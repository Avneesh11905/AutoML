import { Card } from '@mantine/core'

const GoodBg = ({ children}: { children: React.ReactNode;}) => {
  return (
    <Card shadow='sm' radius='md' padding="lg" miw='17vw' className='space-y-4' withBorder > {children}</Card>
  )
}

export default GoodBg