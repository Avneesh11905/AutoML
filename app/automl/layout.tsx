import LogOutButton from "@/components/LogOutButton";
import { Flex } from "@mantine/core";



const Page = ({children}: {children: React.ReactNode}) => {
  
  return (
    <Flex className="h-[100vh] w-full flex-col" >
        <LogOutButton/>
        
        {children}
        
    </Flex>
      
  )
}

export default Page