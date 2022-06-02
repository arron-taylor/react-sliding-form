import { useImperativeHandle } from 'react'

const useElevateChildState = (values, ref, deps) => {
  useImperativeHandle(
    ref,
    () => ({
      getState: () => values
    }),
    deps
  )
}

export default useElevateChildState
