import {
  useEffect,
  useState,
  useRef,
  createElement,
  createRef,
  useMemo
} from 'react'
import {
  Button,
  Box,
  useMediaQuery,
  Stepper,
  StepLabel,
  Step,
  Collapse
} from '@mui/material'
import { ChevronLeftRounded } from '@mui/icons-material'
import AliceCarousel from 'react-alice-carousel'

const SlidingForm = ({
  slideItems,
  closeAction,
  submitAction,
  styles,
  onSlideChange
}) => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [stepReadyStatus, setStepReadyStatus] = useState({})
  const smallScreen = useMediaQuery('(max-width: 1024px)')
  const refs = { ...slideItems.map(() => createRef()) }
  const carouselRef = useRef()
  const lastSlide = currentSlide === slideItems.length - 1
  const submitSlide = currentSlide === slideItems.length - 2

  const steps = slideItems.map(item => item.label).filter(i => i !== undefined)
  const useStepper = steps.length > 0

  const readySteps = Object.keys(stepReadyStatus).map((item, index) =>
    stepReadyStatus[index] === true ? item : ''
  )

  const itemsWithRefs = useMemo(
    () =>
      slideItems.map((item, index) =>
        createElement(item.slide, {
          setIsReady: isReady =>
            isReady !== stepReadyStatus[index] &&
            setStepReadyStatus(prev => ({ ...prev, [index]: isReady })),
          refValue: refs[index]
        })
      ),
    [stepReadyStatus]
  )

  const lastSlideIsVisible = currentSlide === slideItems.length - 1

  const checkIfButtonDisabled = step => !readySteps.includes(step.toString())

  const handleBack = () => {
    carouselRef.current.slidePrev()
  }

  const handleForward = () => {
    carouselRef.current.slideNext()
  }

  const handleClickForward = () => {
    !lastSlide && !submitSlide && handleForward()
    lastSlide && closeAction()

    if (submitSlide) {
        submitAction({
          ...itemsWithRefs.reduce(
            (obj, item) => ({
              ...obj,
              ...item.props.refValue.current.getState()
            }),
            {}
          )
        })
      setTimeout(() => {
        handleForward()
      }, 900)
    }
  }

  const handleClickBack = () => {
    currentSlide !== 0 && handleBack()
    currentSlide === 0 && closeAction()
  }

  const handleSlideChange = e => {
    setCurrentSlide(e)
    // handle slides that do not call setIsReady, automatically set them to ready
    !refs[e].current && setStepReadyStatus(prev => ({ ...prev, [e]: true }))
  }

  useEffect(() => {
    onSlideChange && onSlideChange(currentSlide)
  }, [currentSlide])

  return (
    <Box
      sx={{
        maxWidth: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '12px',
        overflowY: 'hidden'
      }}
    >
      <Box sx={{ maxHeight: '100vh', overflowY: 'hidden' }}>
        <AliceCarousel
          activeIndex={currentSlide}
          animationDuration={600}
          disableDotsControls
          disableButtonsControls
          autoHeight
          mouseTracking={false}
          touchTracking={false}
          onSlideChanged={e => handleSlideChange(e.item)}
          ref={carouselRef}
          items={itemsWithRefs}
        />
      </Box>

      <Box sx={styles.paperChin}>
        {useStepper && (
          <Collapse in={!lastSlideIsVisible}>
            <Stepper
              alternativeLabel={smallScreen}
              activeStep={currentSlide}
              style={{ width: '100%' }}
            >
              {steps.map(label => (
                <Step key={label}>
                  <StepLabel sx={styles.stepLabel}>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Collapse>
        )}
        <Box
          sx={[
            {
              justifyContent: 'space-between',
              display: 'flex'
            },
            useStepper && {
              mt: lastSlideIsVisible ? '0rem' : '1rem'
            }
          ]}
        >
          <Collapse in={!lastSlideIsVisible}>
            <Button
              disableElevation
              disableRipple
              onClick={handleClickBack}
              variant='text'
              sx={[styles.textButton]}
            >
              <ChevronLeftRounded sx={{ mr: '.5rem' }} />
              Back
            </Button>
          </Collapse>
          <Button
            disableElevation
            disabled={checkIfButtonDisabled(currentSlide)}
            onClick={handleClickForward}
            disableRipple
            variant='contained'
            sx={[styles.filledButton]}
          >
            {currentSlide === slideItems.length - 1 ? 'Got it' : 'Next'}
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

export default SlidingForm
