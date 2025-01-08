import {  Flex, Fieldset, Title } from '@mantine/core'

const FormBg = ({ children,title}: { children: React.ReactNode,title :string}) => {
  return (
    <Flex> 
        <Fieldset miw='17vw' className='space-y-4' legend={<Title size='1.5rem'>{title}</Title>}>
    
        {children}
        </Fieldset>
    </Flex>
  )
}

export default FormBg