# react-sliding-form

- Easily build sliding forms (multi-step optional) inside of a mui dialog popup. (live example can be found at https://www.carbodylab.com/) <br />
- Conveniently collect all data gathered in each step only when you need to (reduce the use of context and re-renders caused by passing state down). <br />
- Store all state logic inside of each step themselves, rather than using a context or passing state down. Allow each step to validate itself and inform react-sliding-form when it is complete.
- Conveniently determine when to disable or enable "next" buttons for you, by passing each child (step) of react-sliding-form a setIsReady function, freely called by each child when complete.

## What this does
Allows you to easily build sliding forms (multi-step optional) inside of a dialog popup like the three screenshots below: ![image](https://user-images.githubusercontent.com/67350795/168897457-2ded91d0-7e55-4873-ab53-0f886c78de3f.png)
![image](https://user-images.githubusercontent.com/67350795/168900335-1a6af090-2180-41b1-bdfc-2b6e0958f64f.png)
![image](https://user-images.githubusercontent.com/67350795/168897507-891eb161-615c-422a-9d0e-14d6e43e51c0.png)


## How to use SlidingForm

```
import { Box, Dialog, Button } from '@mui/material
import { SlidingForm } from 'react-sliding-form'
import Slide1 from './Slide1'
import Slide2 from './Slide2'
import Slide3 from './Slide3'
import Slide4 from './Slide4'
import { styles } from './styles'

const slideItems = [
  { slide: Step1, label: 'Vehicle' },
  { slide: Step2, label: 'Photos' },
  { slide: Step3, label: 'Contact' },
  { slide: Step4 }
]

const Container = () => {
  const submitRequest = data = () => fetch('https://www.arrontaylor.me/submit_request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
  
  return (
    <Box>
      <Dialog open={open}>
        <SlidingForm 
          slideItems={slideItems}
          submitAction={v => submitRequest(v)}
          closeAction={() => setOpen(false)}
          styles={styles}
        />  
      </Dialog>
      <Button onClick={_ => setOpen(true)}> Open Dialog </Button>
    </Box>
}

```
## How to write each step
1. Make sure to consume the properties `{ setIsReady, refValue }`
2. Make sure to use the `useElevateChildState` hook and pass it all of the values you want to keep track of, along with the refValue prop, and finally a list of dependencies.
3. When the step is considered "ready", call the `setIsReady` function with the current "ready state" of the step. 
4. Once the step calls setIsReady, the buttons in the stepper will automatically update to allow for "next".

```
import React, { useState, useEffect } from 'react'
import { TextField, Box } from '@mui/material'
import { useElevateChildState } from 'react-sliding-form'

const Step3 = ({ setIsReady, refValue, currentData }) => {
  const [zip, setZip] = useState(null)
  const [name, setName] = useState(null)
  const [phone, setPhone] = useState(null)
  const [email, setEmail] = useState(null)
  const nameIsValid = name && name.trim().length > 1
  const phoneIsValid = phone && /\d{10}/.test(phone)
  const zipIsValid = zip && /^\d{5}$/.test(zip)
  const emailIsValid =
    email && /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)

  // currentData is an up to date global state of all steps

  const contactIsValid =
    (nameIsValid && phoneIsValid && zipIsValid && emailIsValid) || false

  useEffect(() => {
    setIsReady(contactIsValid)
  }, [contactIsValid])

  useElevateChildState({ zip, name, phone, email },
    refValue, [zip, name, phone, email])

  return (
    <Box>
      <Box>
        Enter your contact details Full name
        <TextField
          onChange={e => setName(e.target.value)}
          value={name || ''}
          placeholder='Full Name'
        />
        <br />
        Phone
        <TextField
          onChange={e => setPhone(e.target.value)}
          value={phone || ''}
          placeholder=' (123)  456 &#8212; 7890 '
        />
        <br />
        Your email
        <TextField
          onChange={e => setEmail(e.target.value)}
          value={email || ''}
          placeholder='email@example.com'
        />
        <br />
        Zip code
        <TextField
          onChange={e => setZip(e.target.value)}
          value={zip || ''}
          placeholder='5-Digit ZIP Code'
        />
      </Box>
    </Box>
  )
}

export default Step3

```

