import nextCoreWebVitals from "eslint-config-next/core-web-vitals"
import nextTypescript from "eslint-config-next/typescript"

const eslintConfig = [
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    // enforce no semicolons in our own code (matches project style)
    rules: {
      'semi': ['warn', 'never']
    }
  },
  {
    // shadcn/ui primitives keep their own formatting — don't flag their semicolons
    files: ['components/ui/**'],
    rules: {
      'semi': 'off'
    }
  }
]

export default eslintConfig
