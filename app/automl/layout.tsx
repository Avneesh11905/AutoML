import { TableContextProvider } from "@/components/contexts/TableContext";
import LogOutButton from "@/components/LogOutButton";
import { Flex } from "@mantine/core";



const Page = ({children}: {children: React.ReactNode}) => {
  
  return (
    <TableContextProvider>

    <Flex className="h-[100vh] w-[100vw] flex-col" >
        <LogOutButton/>
        <Flex justify='center' align='center' mah='92vh' maw='100%'>
            {children}
        </Flex>
        
    </Flex>
      
    </TableContextProvider>
  )
}

export default Page