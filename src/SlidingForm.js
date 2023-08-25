import { useEffect, useState, useRef, createElement, createRef, useMemo, memo } from 'react'
import { Button, Box, Stepper, StepLabel, Step, Collapse } from '@mui/material'
import { ChevronLeftRounded } from '@mui/icons-material'

const WrappedSlidingForm = ({
  slideItems,
  closeAction,
  submitAction,
  styles,
  onSlideChange = null,
  beforeSlideChange,
  slideChangeDelay = null,
  smallScreen,
  useStepper = true,
  beforeNextButtonClick = null,
  carouselDataRef = null,
  alternativeLabel = false,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [stepReadyStatus, setStepReadyStatus] = useState({})
  const [buttonDisabled, setButtonDisabled] = useState(false)
  const refs = useMemo(() => ({ ...slideItems.map(() => createRef()) }), [slideItems])
  const carouselRef = useRef()
  const lastSlide = currentSlide === slideItems.length - 1
  const submitSlide = currentSlide === slideItems.length - 2
  const steps = slideItems.map(item => item.label).filter(i => i !== undefined)
  const readySteps = Object.keys(stepReadyStatus).map((item, index) => (stepReadyStatus[index] === true ? item : ''))

  const currentData = Object.values(refs)
    .map(item => {
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

  currentData.currentStep = currentSlide
  carouselDataRef && (carouselDataRef.current = currentData)

  const itemsWithRefs = useMemo(
    () =>
      slideItems.map((item, index) =>
        createElement(item.slide, {
          setIsReady: isReady =>
            isReady !== stepReadyStatus[index] && setStepReadyStatus(prev => ({ ...prev, [index]: isReady })),
          refValue: refs[index],
          key: index,
          currentData: currentData,
        })
      ),
    [stepReadyStatus, currentData, refs, slideItems]
  )

  const lastSlideIsVisible = currentSlide === slideItems.length - 1

  const checkIfButtonDisabled = step => !readySteps.includes(step.toString())

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
      }).then(_ => handleForward())
    }
  }

  const handleClickBack = () => {
    currentSlide !== 0 && handleBack()
    currentSlide === 0 && closeAction()
  }

  currentData.handleBack = handleClickBack
  currentData.handleForward = handleClickForward

  const handleSlideChange = e => {
    setButtonDisabled(false)

    setTimeout(() => {
      setCurrentSlide(e)
      refs[e] && !refs[e].current && setStepReadyStatus(prev => ({ ...prev, [e]: true }))
    }, slideChangeDelay || 250)
  }

  useEffect(() => {
    Array.from(carouselRef.current.childNodes.values()).map(node => (node.style.pointerEvents = 'auto'))
    Array.from(carouselRef.current.childNodes.values()).map(
      node => (node.style.transition = 'all .25s cubic-bezier(0.46, 0.03, 0.52, 0.96) 0s')
    )
  }, [carouselRef])

  useEffect(() => {
    const currentSlideHeight =
      (carouselRef && carouselRef.current && carouselRef.current.childNodes[currentSlide].offsetHeight) || null
    carouselRef.current.style.height = currentSlideHeight + 'px' || '0px'
    if (carouselRef.current) {
      if (beforeSlideChange) {
        beforeSlideChange({
          currentSlide,
          currentData,
        }).then(res => {
          Array.from(carouselRef.current.childNodes.values()).map(
            node =>
              (node.style.transform = `translateX(-${
                currentSlide * carouselRef.current.childNodes[currentSlide].offsetWidth
              }px)`)
          )
        })
      } else {
        Array.from(carouselRef.current.childNodes.values()).map(
          node =>
            (node.style.transform = `translateX(-${
              currentSlide * carouselRef.current.childNodes[currentSlide].offsetWidth
            }px)`)
        )
      }
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
        id='carousel-wrapper'
        ref={carouselRef}
        sx={{
          overflow: 'hidden !important',
          pointerEvents: 'none !important',
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
        {itemsWithRefs.map(item => item)}
      </Box>

      <Box sx={styles.paperChin}>
        {useStepper && (
          <Collapse in={!lastSlideIsVisible}>
            <Stepper
              alternativeLabel={smallScreen || alternativeLabel}
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
              variant='text'
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
              beforeNextButtonClick &&
                beforeNextButtonClick({
                  currentSlide,
                  currentData: Object.values(refs)
                    .map(item => {
                      if (item) {
                        return item
                      }
                    })
                    .reduce(
                      (obj, item) => {
                        if (item.current) {
                          return {
                            ...obj,
                            ...item.current.getState(),
                          }
                        } else {
                          return obj
                        }
                      },
                      {
                        handleBack: handleClickBack,
                        handleForward: handleClickForward,
                      }
                    ),
                })
                  .then(() => {
                    setButtonDisabled(true)
                    handleClickForward()
                  })
                  .catch(e => console.log('error from beforeNextButtonClick, prevented user from moving to next step '))
              if (!beforeNextButtonClick) {
                {
                  setButtonDisabled(true)
                  handleClickForward()
                }
              }
            }}
            disableRipple
            variant='contained'
            sx={[styles.filledButton]}
          >
            {(slideItems[currentSlide] && slideItems[currentSlide].nextButtonLabel) || 'Next'}
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

const SlidingForm = memo(WrappedSlidingForm, () => true)

export default SlidingForm
