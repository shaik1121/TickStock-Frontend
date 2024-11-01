import { useState, useEffect } from 'react';
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
import {
  useFetchBasketsData,
  useFetchStocksData,
} from '@/Queries/portfolio-queries';
import { StocksType } from './portfolio-utils/types';
import CustomSelect from '@/components/ui/custom-select';
import { formatCurrency, formatDate } from '@/lib/utils';
import { usePortfolioStore } from '@/Store/PortfolioStore';
import StocksForm from './Components/stocks-form';

const PortfolioStocks = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchStocksTerm, setSearchStocksTerm] = useState('');
  const [currentPage, setCurrentPage] = useState('1');
  const [isBasketDialogOpen, setIsBasketDialogOpen] = useState(false);
  const [isStocksDialogOpen, setIsStocksDialogOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<
    | {
        label: string | undefined;
        value: string | undefined;
      }
    | undefined
  >(undefined);

  const { data: basketsData } = useFetchBasketsData(
    searchTerm,
    currentPage.toString(),
    '10',
  );
  const { data: stocksData } = useFetchStocksData(
    '',
    currentPage.toString(),
    '10',
    selectedOption?.value || '',
  );

  const columns: ColumnDef<StocksType>[] = [
    {
      id: 'Ticker',
      accessorKey: 'tickerId',
      header: 'Ticker Name',
      cell: ({ row }) => <div>{row.original.tickerId}</div>,
    },
    {
      id: 'Buy Date',
      accessorKey: 'buyDate',
      header: 'Buy Date',
      cell: ({ row }) => <div>{formatDate(row.original.buyDate)}</div>,
    },
    {
      id: 'Buy Price',
      accessorKey: 'buyPrice',
      header: 'Buy Price',
      cell: ({ row }) => (
        <div className="font-medium">
          {formatCurrency(row.original.buyPrice)}
        </div>
      ),
    },
    {
      id: 'Invested Amount',
      accessorKey: 'investedAmount',
      header: 'Invested Amount',
      cell: ({ row }) => (
        <div className="font-medium">
          {formatCurrency(row.original.investedAmount)}
        </div>
      ),
    },
    {
      id: 'Broker Name',
      accessorKey: 'brokerName',
      header: 'Broker Name',
      cell: ({ row }) => <div>{row.original.brokerName}</div>,
    },
    {
      id: 'actions',
      cell: () => (
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
                // setEditPayload(row.original);
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
      ),
    },
  ];
  const [options, setOptions] = useState<{ label: string; value: string }[]>(
    [],
  );
  const { selectedBasketOption, setField } = usePortfolioStore();
  useEffect(() => {
    if (basketsData) {
      const result = basketsData.data.map(item => ({
        label: item.basketName,
        value: item.id,
      }));
      console.log(result, 'result');
      setOptions(result);
      const checkIfIdExists = result.find(
        item => item?.value === selectedBasketOption?.value,
      );
      if (checkIfIdExists === undefined && selectedBasketOption?.value === '') {
        setField('selectedBasketOption', result[0]);
      }
    }
  }, [basketsData, selectedBasketOption, setField]);
  useEffect(() => {
    setSelectedOption(selectedBasketOption);
  }, [selectedBasketOption]);

  return (
    <div className="mx-auto w-full p-2 h-full overflow-y-auto">
      {/* Header Card */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="flex items-center justify-between bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
          <CardHeader>
            <CardTitle className="text-white text-4xl font-bold">
              Stocks
            </CardTitle>
          </CardHeader>
          <CardContent className="flex justify-between items-center">
            {basketsData &&
              Number(basketsData.pagination.totalCumulativeCount) > 0 && (
                <Button
                  variant="secondary"
                  className="relative top-[12px]"
                  onClick={() => setIsStocksDialogOpen(true)}
                >
                  <Plus className="mr-2 h-4 w-4" /> Create Stocks
                </Button>
              )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Search and Table */}
      {basketsData &&
      Number(basketsData.pagination.totalCumulativeCount) > 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="flex flex-col gap-2 w-1/4 mt-5">
            <CustomSelect
              options={options}
              value={selectedOption}
              onChange={value => {
                setSelectedOption(value);
                setField(
                  'selectedBasketOption',
                  value as {
                    label: string;
                    value: string;
                  },
                );
              }}
              label="Basket"
              placeholder="Select a basket"
              setSearchTerm={setSearchTerm}
            />
          </div>

          <DataTable
            columns={columns}
            data={(stocksData?.data as StocksType[]) || []}
            pagination={{
              metadata: stocksData?.pagination,
              currentPage: currentPage,
              setCurrentPage: setCurrentPage,
            }}
            search={{
              searchTerm: searchStocksTerm,
              setSearchTerm: setSearchStocksTerm,
            }}
            title="Stock Table"
          />
        </motion.div>
      ) : (
        <div className="flex justify-center items-center h-full flex-col gap-5">
          <h1 className="text-2xl font-bold">No baskets available</h1>
          <Button
            variant="secondary"
            onClick={() => setIsBasketDialogOpen(true)}
          >
            <Plus className="h-4 w-4" /> Create Basket
          </Button>
        </div>
      )}

      <BasketForm
        isBasketDialogOpen={isBasketDialogOpen}
        setIsBasketDialogOpen={setIsBasketDialogOpen}
      />
      <StocksForm
        // editPayload={editPayload}
        isStocksDialogOpen={isStocksDialogOpen}
        setIsStocksDialogOpen={setIsStocksDialogOpen}
      />
    </div>
  );
};

export default PortfolioStocks;
