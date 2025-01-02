'use client'
import React , { createContext, useState } from 'react';

export type TableType = {
    head: string[],
    body: Array<Array<string | number | null>> 
}

type TableContextType = {   
    tableData: TableType | undefined,
    setTableData: React.Dispatch<React.SetStateAction<TableType | undefined>>
}   
type TableContextProviderProps = {
    children: React.ReactNode;
}

export const TableContext = createContext< TableContextType | null>(null);

export const TableContextProvider = ({children}: TableContextProviderProps) => {
    const [tableData, setTableData] = useState<TableType | undefined>(undefined);
    return (
        <TableContext.Provider value={{tableData, setTableData}}>
            {children}
        </TableContext.Provider>
    )   
}
