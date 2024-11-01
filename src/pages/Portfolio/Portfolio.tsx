import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FilePenLine, MoreHorizontal, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import BasketForm from './Components/basket-form';
import { DataTable } from '@/components/Global/data-table';
import { ColumnDef } from '@tanstack/react-table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useFetchBasketsData } from '@/Queries/portfolio-queries';
import { BasketType } from './portfolio-utils/types';

const Portfolio = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState('1');
  const [isBasketDialogOpen, setIsBasketDialogOpen] = useState(false);
  const [editPayload, setEditPayload] = useState<BasketType | undefined>(
    undefined,
  );

  const { data: basketsData } = useFetchBasketsData(
    searchTerm,
    currentPage.toString(),
    '10',
  );
  useEffect(() => {
    if (basketsData) {
      console.log(basketsData, 'basketsssss');
    }
  }, [basketsData]);
  const columns: ColumnDef<BasketType>[] = [
    {
      id: 'Basket Name',
      accessorKey: 'basketName',
      header: 'Basket Name',
    },
    {
      id: 'stock Count',
      accessorKey: 'stockCount',
      header: 'Stock Count',
      cell: () => {
        // const stockCount = row.getValue("stockCount");
        return <div className="font-medium">0</div>;
      },
    },
    {
      id: 'Invested Value',
      accessorKey: 'investedValue',
      header: 'Invested Value',
      cell: () => {
        // const amount = parseFloat(row.getValue("amount"));
        const formatted = new Intl.NumberFormat('en-IN', {
          style: 'currency',
          currency: 'INR',
        }).format(300.55);

        return <div className="font-medium">{formatted}</div>;
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => {
                  setEditPayload(row.original);
                  setIsBasketDialogOpen(true);
                }}
              >
                <FilePenLine color="#fa7900" />
                Edit Basket
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Trash2 color="#fa0000" /> Delete Basket
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
  const [selectedRows, setSelectedRows] = useState<BasketType[]>([]);

  const handleRowSelectionChange = useCallback(
    (rows: BasketType[]) => {
      // console.log(memoizedSelectedRows, "rows");
      setSelectedRows(rows);
    },
    [setSelectedRows],
  );

  useEffect(() => {
    console.log(selectedRows, 'selectedRows');
  }, [selectedRows]);
  return (
    <div className={` mx-auto w-full p-2 h-full overflow-y-auto  `}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="flex items-center justify-between bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
          <CardHeader>
            <CardTitle className="text-white text-4xl font-bold">
              Basket
            </CardTitle>
          </CardHeader>
          <CardContent className="flex justify-between items-center">
            <Button
              variant="secondary"
              className="relative top-[12px]"
              onClick={() => {
                setIsBasketDialogOpen(true);
              }}
            >
              <Plus className="mr-2 h-4 w-4" /> Create Basket
            </Button>
          </CardContent>
        </Card>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <DataTable
          columns={columns}
          data={(basketsData?.data as BasketType[]) || []}
          // Modules
          pagination={{
            metadata: basketsData?.pagination,
            currentPage: currentPage,
            setCurrentPage: setCurrentPage,
          }}
          search={{
            searchTerm: searchTerm,
            setSearchTerm: setSearchTerm,
          }}
          onRowSelectionChange={handleRowSelectionChange}
          title="Baskets Table"
        />
      </motion.div>
      <BasketForm
        editPayload={editPayload}
        isBasketDialogOpen={isBasketDialogOpen}
        setIsBasketDialogOpen={setIsBasketDialogOpen}
      />
    </div>
  );
};

export default Portfolio;
