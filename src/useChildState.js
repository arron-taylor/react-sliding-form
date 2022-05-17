import { useImperativeHandle } from 'react'

const useChildState = (values, ref, deps) => {
  useImperativeHandle(
    ref,
    () => ({
      getState: () => values
    }),
    deps
  )
}

export default useChildState
