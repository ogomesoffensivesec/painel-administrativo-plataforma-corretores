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
  PlusIcon,
  TrashIcon,
  PrinterIcon,
  EyeIcon,
} from "lucide-react";
import {
  createOrder,
  deleteOrder,
  updateStatusOrder,
} from "./_components/orders.functions";
import { toast } from "@/components/ui/use-toast";
import { database } from "@/database/config/firebase";
import { off, onValue, ref } from "firebase/database";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

const useOrders = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const ordersRef = ref(database, `/orders/`);

    const handleDataChange = (snapshot) => {
      if (snapshot.val()) {
        const orders = snapshot.val(); // Obtém os dados em tempo real
        const formattedData = Object.values(orders).map((order) => ({
          username: order.username,
          build: order.build,
          userId: order.userId,
          createAt: order.createAt,
          id: order.id,
          items: JSON.stringify(order.items),
          status: order.status,
          cancelRequests: order.cancelRequests ? order.cancelRequests : null,
        }));

        formattedData.sort(
          (a, b) => new Date(a.createAt) - new Date(b.createAt)
        );
        setPedidos(formattedData);
      }
      setLoading(false);
    };

    // Configura o listener para mudanças em tempo real
    onValue(ordersRef, handleDataChange, { onlyOnce: false });

    // Cleanup function para remover o listener quando o componente for desmontado
    return () => {
      off(ordersRef, "value", handleDataChange);
    };
  }, []); // Dependência vazia para executar apenas uma vez

  if (loading) {
    return <div>Loading...</div>;
  }

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

const PedidoTable = ({
  pedidos,
  handleStatusChange,
  formatDate,
  handleCancelOrderByRequest,
  loadState,
}) => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Usuário</TableHead>
        <TableHead>Endereço de Obra</TableHead>
        <TableHead>Quantidade de Itens</TableHead>
        <TableHead>Data de Criação</TableHead>
        <TableHead className="w-[250px]">Status</TableHead>
        <TableHead className="text-center">Ações</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {pedidos.map((pedido) => (
        <TableRow key={pedido.id}>
          <TableCell>{pedido.username}</TableCell>
          <TableCell>{pedido.build}</TableCell>
          <TableCell>{formatDate(pedido.createAt)}</TableCell>
          <TableCell>{pedido.items?.length}</TableCell>
          <TableCell>
            <Select
              value={pedido.status}
              onValueChange={(value) => handleStatusChange(pedido.id, value)}
            >
              <SelectTrigger>
                <SelectValue>
                  {pedido.status === "em_transito" && "Em trânsito"}
                  {pedido.status === "entregue" && "Entregue"}
                  {pedido.status === "cancelado" && "Cancelado"}
                  {pedido.status === "aguardando_aprovacao" &&
                    "Aguardando aprovação"}
                  {pedido.status === "enviado_fornecedor" &&
                    "Enviando fornecedor"}
                </SelectValue>
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
          <TableCell className="flex items-center justify-center gap-3">
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
            {pedido.cancelRequests && (
              <div className="flex items-center justify-center p-2 bg-destructive rounded-md shadow-md">
                <HoverCard>
                  <HoverCardTrigger className="hover:cursor-pointer">
                    <ExclamationTriangleIcon className="text-white h-5 w-5" />
                  </HoverCardTrigger>
                  <HoverCardContent className="space-y-2">
                    <span className="font-semibold text-zinc-800">
                      Pedido de cancelamento!
                    </span>
                    <div>
                      <span className="font-medium text-zinc-800">
                        Usuário:
                      </span>{" "}
                      {""}
                      <span>{pedido.username}</span>
                    </div>
                    <div>
                      <span className="font-medium text-zinc-800">
                        Solicitado em:
                      </span>{" "}
                      {""}
                      <span>
                        {formatDate(pedido?.cancelRequests.createdAt)}
                      </span>
                      <Button
                        size="sm"
                        disabled={loadState}
                        className="mt-2"
                        variant="destructive"
                        onClick={() => handleCancelOrderByRequest(pedido.id)}
                      >
                        {loadState ? "Cancelando pedido..." : "Cancelar pedido"}
                      </Button>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              </div>
            )}
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

export default function PedidosOrcamentos() {
  const { pedidos, loading, setPedidos } = useOrders();
  const [loadState, setLoadState] = useState(false);
  const { filters, handleFilterChange, clearFilters } = useFilters();
  const [items, setItems] = useState([]);
  const [obraSelecionada, setObraSelecionada] = useState("");
  const [newItem, setNewItem] = useState({
    description: "",
    quantity: 0,
    type: "",
  });

  const handleStatusChange = async (id, value) => {
    try {
      const updatedOrder = await updateStatusOrder(id, value);
      if (!updatedOrder) {
        const updatedPedidos = pedidos.map((pedido) =>
          pedido.id === id ? { ...pedido, status: value } : pedido
        );
        setPedidos(updatedPedidos);
        toast({
          title: "Status atualizado com sucesso!",
          variant: "success",
        });
      }
    } catch (error) {
      console.log(error);
      toast({
        variant: "destructive",
        title: "Erro ao atualizar status!",
        description: "Por favor, tente novamente.",
      });
    }
  };

  const handleCreateOrder = async () => {
    const newOrder = {
      build: obraSelecionada,
      items: JSON.stringify(items),
    };

    try {
      const response = await createOrder(newOrder);
      if (!response) {
        setPedidos((prevPedidos) => [...prevPedidos, response.data]);
        toast({
          title: "Pedido criado com sucesso!",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao criar pedido!",
        description: "Por favor, tente novamente.",
      });
    }
  };

  const filteredPedidos = pedidos.filter(
    (pedido) =>
      (!filters.user || pedido.user === filters.user) &&
      (!filters.build || pedido.build === filters.build) &&
      (!filters.status || pedido.status === filters.status)
  );
  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  };

  const handleCancelOrderByRequest = async (orderId) => {
    setLoadState(true);
    const response = await updateStatusOrder(orderId, 'cancelado');
    if (response) {
      toast({
        title: "Erro ao cancelar pedido",
        variant: "destructive",
      });
      console.error(response);
      setLoadState(false);
      return;
    }
    toast({
      title: "Pedido cancelado com sucesso!",
      variant: "destructive",
    });
    setLoadState(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div>
            Pedidos de compra
            <CardDescription>
              Gerencie seus pedidos de compra e orçamentos.
            </CardDescription>
          </div>
          <Dialog>
            <DialogTrigger className="bg-indigo-600 hover:bg-indigo-400 px-3 py-2  text-white rounded-md flex items-center justify-center text-sm">
              <PlusIcon className="mr-2 h-4 w-4" /> Criar Pedido
            </DialogTrigger>
            <DialogContent className="sm:max-w-[625px]">
              <DialogHeader>
                <DialogTitle>Criar Novo Pedido</DialogTitle>
                <DialogDescription>
                  Preencha as informações abaixo para criar um novo pedido.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-2 pb-4">
                <div className="space-y-2">
                  <Label>Endereço da Obra</Label>
                  <Select onValueChange={(value) => setObraSelecionada(value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione a obra" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="donateka">Donateka</SelectItem>
                      <SelectItem value="sanmake">San Make</SelectItem>
                      <SelectItem value="bruce">Residencial Bruce</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Adicionar Itens</Label>
                  <div className="space-y-2">
                    <Input
                      type="text"
                      placeholder="Descrição do Item"
                      value={newItem.description}
                      onChange={(e) =>
                        setNewItem({ ...newItem, description: e.target.value })
                      }
                    />
                    <Input
                      type="number"
                      placeholder="Quantidade"
                      value={newItem.quantity}
                      onChange={(e) =>
                        setNewItem({ ...newItem, quantity: +e.target.value })
                      }
                    />
                    <Input
                      type="text"
                      placeholder="Tipo de Item"
                      value={newItem.type}
                      onChange={(e) =>
                        setNewItem({ ...newItem, type: e.target.value })
                      }
                    />
                    <Button
                      onClick={() => {
                        setItems([...items, newItem]);
                        setNewItem({ description: "", quantity: 0, type: "" });
                      }}
                    >
                      Adicionar Item
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <Label>Itens Adicionados</Label>
                    <ul>
                      {items.map((item, index) => (
                        <li key={index}>{item.description}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <DialogClose>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setItems([]);
                      setNewItem({ description: "", quantity: 0, type: "" });
                    }}
                  >
                    Cancelar
                  </Button>
                </DialogClose>
                <Button onClick={handleCreateOrder}>Salvar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col">
        <FilterBar
          handleFilterChange={handleFilterChange}
          clearFilters={clearFilters}
        />
        {loading ? (
          <div>Carregando...</div>
        ) : (
          <PedidoTable
            pedidos={filteredPedidos}
            handleStatusChange={handleStatusChange}
            formatDate={formatDate}
            handleCancelOrderByRequest={handleCancelOrderByRequest}
            loadState={loadState}
          />
        )}
      </CardContent>
    </Card>
  );
}
