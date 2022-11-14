import { useEffect, useState, useRef, createElement, createRef, useMemo } from 'react'
import { Button, Box, useMediaQuery, Stepper, StepLabel, Step, Collapse } from '@mui/material'
import { ChevronLeftRounded } from '@mui/icons-material'


const SlidingForm = ({ slideItems, closeAction, submitAction, styles, onSlideChange, ...props }) => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [stepReadyStatus, setStepReadyStatus] = useState({})
  const [currentData, setCurrentData] = useState({})
  const [buttonDisabled, setButtonDisabled] = useState(false)
  const smallScreen = useMediaQuery('(max-width: 1024px)')
  const refs = { ...slideItems.map(() => createRef()) }
  const carouselRef = useRef()
  const lastSlide = currentSlide === slideItems.length - 1
  const submitSlide = currentSlide === slideItems.length - 2

  const steps = slideItems.map((item) => item.label).filter((i) => i !== undefined)
  const useStepper = steps.length > 0

  const readySteps = Object.keys(stepReadyStatus).map((item, index) => (stepReadyStatus[index] === true ? item : ''))

  const itemsWithRefs = useMemo(
    () =>
      slideItems.map((item, index) =>
        createElement(item.slide, {
          setIsReady: (isReady) =>
            isReady !== stepReadyStatus[index] && setStepReadyStatus((prev) => ({ ...prev, [index]: isReady })),
          refValue: refs[index],
          key: index,
          currentData: currentData,
          ...props,
        })
      ),
    [stepReadyStatus, currentData]
  )

  const lastSlideIsVisible = currentSlide === slideItems.length - 1

  const checkIfButtonDisabled = (step) => !readySteps.includes(step.toString())

  const handleBack = () => {
    handleSlideChange(currentSlide - 1)
  }

  const handleForward = () => {
    handleSlideChange(currentSlide + 1)
  }

  const handleClickForward = () => {
    !lastSlide && !submitSlide && handleForward()
    lastSlide && closeAction()

    if (submitSlide) {
      submitAction({
        ...itemsWithRefs.reduce((obj, item) => {
          if (item.props.refValue.current) {
            return {
              ...obj,
              ...item.props.refValue.current.getState(),
            }
          } else {
            return obj
          }
        }, {}),
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

  const handleSlideChange = (e) => {
    carouselRef.current && (carouselRef.current.style.overflowX = 'auto')
    setButtonDisabled(false)

    setTimeout(() => {
      setCurrentSlide(e)
      setTimeout(() => {
        carouselRef.current && (carouselRef.current.style.overflowX = 'hidden')
      }, 750)
    }, 150)

    // handle slides that do not call setIsReady, automatically set them to ready
    refs[e] && !refs[e].current && setStepReadyStatus((prev) => ({ ...prev, [e]: true }))

    setTimeout(
      () =>
        setCurrentData(
          Object.values(refs)
            .map((item) => {
              if (item) {
                return item
              }
            })
            .reduce((obj, item) => {
              if (item.current) {
                return {
                  ...obj,
                  ...item.current.getState(),
                }
              } else {
                return obj
              }
            }, {})
        ),
      300
    )

  }

  useEffect(() => {
    // on first render, set the height to match the first child
    const firstSlideHeight =
      (carouselRef && carouselRef.current && carouselRef.current.childNodes[0].offsetHeight) || null
    carouselRef.current.style.height = firstSlideHeight + 'px' || '0px'

    // fix for iOS bug that breaks scrolling on a div with overflow: hidden;
    firstSlideHeight &&
      Array.from(carouselRef.current.childNodes.values()).map((node) => (node.style.pointerEvents = 'auto'))
  }, [carouselRef])

  useEffect(() => {
    const currentSlideHeight =
      (carouselRef && carouselRef.current && carouselRef.current.childNodes[currentSlide].offsetHeight) || null
    carouselRef.current.style.height = currentSlideHeight + 'px' || '0px'

    if (carouselRef.current) {
      carouselRef.current.scrollTo({
        left: currentSlide * carouselRef.current.childNodes[currentSlide].offsetWidth,
        behavior: 'smooth',
      })
    }

    onSlideChange &&
      onSlideChange({
        currentSlide,
        currentData,
      })
  }, [currentSlide])

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box
        id="carousel-wrapper"
        ref={carouselRef}
        sx={{
          overflow: 'hidden',
          overflowX: 'hidden',
          pointerEvents: 'none',
          display: 'flex',
          transition: 'all .5s ease-in-out',
          '&::-webkit-scrollbar': {
            display: {
              xs: 'none !important',
              sm: 'none !important',
              md: 'block',
            },
          },
        }}
      >
        {itemsWithRefs.map((item) => item)}
      </Box>

      <Box sx={styles.paperChin}>
        {useStepper && (
          <Collapse in={!lastSlideIsVisible}>
            <Stepper alternativeLabel={smallScreen} activeStep={currentSlide} style={{ width: '100%' }}>
              {steps.map((label) => (
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
              display: 'flex',
            },
            useStepper && {
              mt: lastSlideIsVisible ? '0rem' : '1rem',
            },
          ]}
        >
          <Collapse in={!lastSlideIsVisible}>
            <Button
              disableElevation
              disableRipple
              onClick={() => {
                setButtonDisabled(true)
                handleClickBack()
              }}
              variant="text"
              sx={[styles.textButton]}
              disabled={buttonDisabled}
            >
              <ChevronLeftRounded sx={{ mr: '.5rem' }} />
              Back
            </Button>
          </Collapse>
          <Button
            disableElevation
            disabled={checkIfButtonDisabled(currentSlide) || buttonDisabled}
            onClick={() => {
              setButtonDisabled(true)
              handleClickForward()
            }}
            disableRipple
            variant="contained"
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
