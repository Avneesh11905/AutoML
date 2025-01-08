import { TableType } from '@/components/contexts/TableContext'
import { Card, Flex, Pagination, Select, Table, Title } from '@mantine/core'
import { useEffect, useState } from 'react';

const TableDisplay = ({ tableData, title }: { tableData: TableType | undefined, title?: string }) => {
  const tableLength = tableData?.body?.length;
  const [numberOfVisibleRows, setNumberOfVisibleRows] = useState<number>(10);
  const [visibleTable, setVisibleTable] = useState<TableType | undefined>(undefined);
  const [activePage, setPage] = useState(1);
  const [numberPages, setNumberPages] = useState<number | null>(null);

  useEffect(() => {
    setVisibleTable({ head: tableData?.head, body: tableData?.body?.slice(numberOfVisibleRows * (activePage - 1), numberOfVisibleRows * activePage) });
    const pages = tableLength! / numberOfVisibleRows;
    const isInteger = Number.isInteger(pages);
    if (isInteger) {
      setNumberPages(pages);
    } else {
      setNumberPages(Math.floor(pages) + 1);
      if (activePage > Math.floor(pages) + 1) {
        setPage(Math.floor(pages) + 1);
      }
    }
  }, [numberOfVisibleRows, activePage , tableLength , tableData])

  const handelSelect = (value: string) => {
    setNumberOfVisibleRows(parseInt(value));
  }

  return (
    <Flex className='flex-col' gap='xl'>
      <Flex pos='relative' align="center" justify="end">
        <Title
          order={3}
          className="absolute left-1/2 -translate-x-1/2"
        >
          {title}
        </Title>
        <Select
          placeholder="Pick value"
          data={['10', '15']}
          defaultValue="10"
          onChange={(value) => handelSelect(value!)}
          allowDeselect={false}
          w='5%'
        />
      </Flex>
      <Card shadow='sm' mih={numberOfVisibleRows == 10 ? '47vh' : '67vh'} radius='md' padding="lg" withBorder >
        <Table data={visibleTable} striped withTableBorder withColumnBorders miw='75vw' />
      </Card>
      <Flex justify='center'>
        <Pagination value={activePage} onChange={setPage} total={numberPages!} />
      </Flex>
    </Flex>
  )
}

export default TableDisplay