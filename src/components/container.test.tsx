import { render } from '@testing-library/react'
import { Container } from './container'

describe('Container Component', () => {
  it('should render correctly with default props', () => {
    const { container } = render(<Container>Test Content</Container>)
    expect(container.firstChild).toHaveClass(
      'flex-1 -z-20 absolute ml-[250px] mt-[80px] min-h-[calc(100vh-80px)] w-[calc(100vw-250px)]'
    )
  })

  it('should merge additional className with default classes', () => {
    const { container } = render(
      <Container className="additional-class">Test Content</Container>
    )
    expect(container.firstChild).toHaveClass(
      'flex-1 -z-20 absolute ml-[250px] mt-[80px] min-h-[calc(100vh-80px)] w-[calc(100vw-250px)] additional-class'
    )
  })

  it('should render children correctly', () => {
    const { getByText } = render(<Container>Test Content</Container>)
    expect(getByText('Test Content')).toBeInTheDocument()
  })
})
