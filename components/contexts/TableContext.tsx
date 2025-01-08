'use client'
import React , { createContext, useState } from 'react';

export type TableType = {
    head: string[]|undefined,
    body: Array<Array<string | number | null>> | undefined
}

type TableContextType = {   
    originalTableData: TableType | undefined,
    setOriginalTableData: React.Dispatch<React.SetStateAction<TableType | undefined>>
    currentTableData: TableType | undefined,
    setCurrentTableData: React.Dispatch<React.SetStateAction<TableType | undefined>>
}   
type TableContextProviderProps = {
    children: React.ReactNode;
}

export const TableContext = createContext< TableContextType | null>(null);

export const TableContextProvider = ({children}: TableContextProviderProps) => {
    const [originalTableData, setOriginalTableData] = useState<TableType | undefined>(undefined);
    const [currentTableData, setCurrentTableData] = useState<TableType | undefined>(undefined);
    return (
        <TableContext.Provider value={{originalTableData, setOriginalTableData , currentTableData, setCurrentTableData }}>
            {children}
        </TableContext.Provider>
    )   
}
