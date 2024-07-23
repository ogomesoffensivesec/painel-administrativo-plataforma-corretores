"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  BellIcon,
  CheckIcon,
  FilePenIcon,
  PlusIcon,
  TrashIcon,
  XIcon,
  PrinterIcon,
  EyeIcon,
  Search,
} from "lucide-react";
import { filterAllOrders } from "./_components/orders.functions";

const useOrders = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const orders = await filterAllOrders();
        const formattedData = Object.values(orders[0]).map((order) => ({
          build: order.build,
          createAt: order.createAt,
          id: order.id,
          items: JSON.stringify(order.items),
          status: order.status,
          cancelRequests: order.cancelRequests
            ? JSON.stringify(order.cancelRequests)
            : null,
        }));
        setPedidos(formattedData);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return { pedidos, loading, setPedidos };
};

const useFilters = () => {
  const [filters, setFilters] = useState({
    user: "",
    build: "",
    status: "",
  });

  const handleFilterChange = (field, value) => {
    setFilters({ ...filters, [field]: value });
  };

  const clearFilters = () => {
    setFilters({
      user: "",
      build: "",
      status: "",
    });
  };

  return { filters, handleFilterChange, clearFilters };
};

const FilterBar = ({ handleFilterChange, clearFilters }) => (
  <div className="flex items-center justify-between gap-5 mb-4 pt-8">
    <div className="flex gap-2">
      <Select onValueChange={(value) => handleFilterChange("user", value)}>
        <SelectTrigger>
          <SelectValue placeholder="Filtrar por usuário" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="joao">João Silva</SelectItem>
          <SelectItem value="maria">Maria Rodrigues</SelectItem>
          <SelectItem value="fabio">Fábio Costa</SelectItem>
          <SelectItem value="josefa">Josefa Oliveira</SelectItem>
        </SelectContent>
      </Select>
      <Select onValueChange={(value) => handleFilterChange("build", value)}>
        <SelectTrigger>
          <SelectValue placeholder="Filtrar por obra" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="donateka">Donateka</SelectItem>
          <SelectItem value="sanmake">San Make</SelectItem>
          <SelectItem value="bruce">Residencial Bruce</SelectItem>
        </SelectContent>
      </Select>
      <Select onValueChange={(value) => handleFilterChange("status", value)}>
        <SelectTrigger>
          <SelectValue placeholder="Filtrar por status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="aguardando_aprovacao">
            Aguardando Aprovação
          </SelectItem>
          <SelectItem value="enviado_fornecedor">
            Enviado para Fornecedor
          </SelectItem>
          <SelectItem value="em_transito">Em Trânsito</SelectItem>
          <SelectItem value="entregue">Entregue</SelectItem>
          <SelectItem value="cancelado">Cancelado</SelectItem>
        </SelectContent>
      </Select>
      <Button type="button" className="w-[300px]" onClick={clearFilters}>
        Limpar Filtros
      </Button>
    </div>
  </div>
);

const PedidoTable = ({ pedidos, handleStatusChange }) => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Endereço de Obra</TableHead>
        <TableHead>Quantidade de Itens</TableHead>
        <TableHead>Data de Criação</TableHead>
        <TableHead>Status</TableHead>
        <TableHead>Ações</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {pedidos.map((pedido, index) => (
        <TableRow key={index}>
          <TableCell>{pedido.build}</TableCell>
          <TableCell>{pedido.items?.length}</TableCell>
          <TableCell>{pedido.createAt}</TableCell>
          <TableCell>
            <Select
              value={pedido.status}
              onValueChange={(value) => handleStatusChange(index, value)}
            >
              <SelectTrigger>
                <SelectValue>{pedido.status}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="aguardando_aprovacao">
                  Aguardando Aprovação
                </SelectItem>
                <SelectItem value="enviado_fornecedor">
                  Enviado para Fornecedor
                </SelectItem>
                <SelectItem value="em_transito">Em Trânsito</SelectItem>
                <SelectItem value="entregue">Entregue</SelectItem>
                <SelectItem value="cancelado">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </TableCell>
          <TableCell>
            <DropdownMenu>
              <DropdownMenuTrigger className="bg-indigo-600 dark:bg-indigo-500/80 text-white py-2 rounded-md shadow-md w-auto px-5">
                Opções
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Ações</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2 text-zinc-500"
                  >
                    <TrashIcon className="h-4 w-4 text-red-500" />
                    <span className="text-red-400">Cancelar Pedido</span>
                  </Button>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2 text-zinc-500"
                  >
                    <BellIcon className="h-4 w-4 text-indigo-500" />
                    <span className="text-indigo-500">Notificar Usuário</span>
                  </Button>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2 text-zinc-500"
                  >
                    <PrinterIcon className="h-4 w-4" />
                    <span>Imprimir Pedido</span>
                  </Button>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2 text-indigo-500"
                  >
                    <EyeIcon className="h-4 w-4" />
                    <span>Ver Pedido</span>
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

export default function PedidosOrcamentos() {
  const { pedidos, loading, setPedidos } = useOrders();
  const { filters, handleFilterChange, clearFilters } = useFilters();
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({
    description: "",
    quantity: 0,
    type: "",
  });

  const handleStatusChange = (index, value) => {
    const updatedPedidos = [...pedidos];
    updatedPedidos[index].status = value;
    setPedidos(updatedPedidos);
  };

  const filteredPedidos = pedidos.filter(
    (pedido) =>
      (filters.user === "" || pedido.user === filters.user) &&
      (filters.build === "" || pedido.build === filters.build) &&
      (filters.status === "" || pedido.status === filters.status)
  );

  const addItem = () => {
    setItems([...items, newItem]);
    setNewItem({ description: "", quantity: 0, type: "" });
  };

  const updateItem = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;
    setItems(updatedItems);
  };

  const removeItem = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
  };
  return (
    <Card>
      <div className="border-b border-muted pb-4">
        <CardHeader className="px-0 py-0">
          <div className="flex  py-6 px-10  border-b-zinc-300  border-[1px] items-center justify-between">
            <div className="  w-full">
              <CardTitle>Pedidos de Obra</CardTitle>
              <CardDescription>
                Listagem completa de pedidos realizados
              </CardDescription>
            </div>
            <Dialog>
              <DialogTrigger className="bg-indigo-600 dark:bg-indigo-500/80 text-white py-2 rounded-md shadow-md px-2 w-[170px] flex items-center justify-center gap-2">
                <PlusIcon className="w-4 h-4" />
                <span className="text-sm">Adicionar Pedido</span>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Adicionar Pedido</DialogTitle>
                  <DialogDescription>
                    Preencha as informações para adicionar um novo pedido
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="items">Itens</Label>
                    <ul className="grid gap-4">
                      {items.map((item, index) => (
                        <li
                          key={index}
                          className="flex items-center justify-between"
                        >
                          <div>
                            <div className="font-medium">
                              {item.description}
                            </div>
                            <div className="text-muted-foreground">
                              Quantidade: {item.quantity} | Tipo: {item.type}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                updateItem(index, "description", "Edited Item")
                              }
                            >
                              <FilePenIcon className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                removeItem(index);
                                DialogClose.current.click();
                              }}
                            >
                              <TrashIcon className="h-4 w-4" />
                            </Button>
                          </div>
                        </li>
                      ))}
                      <li className="flex items-center justify-between w-full">
                        <div className="grid gap-2 w-full mr-8">
                          <Input
                            placeholder="Descrição do item"
                            value={newItem.description}
                            onChange={(e) =>
                              setNewItem({
                                ...newItem,
                                description: e.target.value,
                              })
                            }
                          />
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              placeholder="Quantidade"
                              value={newItem.quantity}
                              onChange={(e) =>
                                setNewItem({
                                  ...newItem,
                                  quantity: parseInt(e.target.value),
                                })
                              }
                              className="w-16"
                            />
                            <Input
                              placeholder="Tipo"
                              value={newItem.type}
                              onChange={(e) =>
                                setNewItem({ ...newItem, type: e.target.value })
                              }
                            />
                          </div>
                        </div>
                        <Button variant="outline" size='sm' onClick={addItem}>
                          <PlusIcon className="h-4 w-4" /> Adicionar
                        </Button>
                      </li>
                    </ul>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="build">Obra</Label>
                    <Input id="build" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="createAt">Data de Criação</Label>
                    <Input id="createAt" type="date" />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">
                    <CheckIcon className="h-4 w-4 mr-2" />
                    Criar Pedido
                  </Button>
                  <DialogClose className="flex items-center justify-center text-sm">
                    <XIcon className="h-4 w-4 mr-2" />
                    Cancelar
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
      </div>
      <CardContent className="px-5 py-1">
        <div className="rounded-md p-5">
          <FilterBar
            handleFilterChange={handleFilterChange}
            clearFilters={clearFilters}
          />
          <PedidoTable
            pedidos={filteredPedidos}
            handleStatusChange={handleStatusChange}
          />
        </div>
      </CardContent>
    </Card>
  );
}
