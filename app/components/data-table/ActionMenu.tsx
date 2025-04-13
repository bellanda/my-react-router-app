import { Edit, Eye, MoreHorizontal, Trash2 } from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

interface ActionMenuProps {
  id: string | number;
  baseUrl: string;
  onEdit?: (id: string | number, row?: any) => void;
  onDelete?: (id: string | number, row?: any) => void;
  onView?: (id: string | number, row?: any) => void;
  row?: any;
  customItems?: ReactNode;
  triggerButton?: ReactNode;
}

export default function ActionMenu({
  id,
  baseUrl,
  onEdit,
  onDelete,
  onView,
  row,
  customItems,
  triggerButton,
}: ActionMenuProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleDelete = () => {
    if (onDelete) {
      onDelete(id, row);
    }
  };

  return (
    <div
      className="flex items-center justify-center"
      onClick={(e) => e.stopPropagation()}
    >
      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger>
          {triggerButton ? (
            triggerButton
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="flex h-8 items-center gap-1 p-2"
            >
              <MoreHorizontal className="h-4 w-4" />
              <span className="hidden sm:inline"></span>
            </Button>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[110px]">
          {/* Itens padrão */}
          {!customItems && (
            <>
              <DropdownMenuItem>
                <Link
                  to={`${baseUrl}/${id}/view`}
                  className="flex w-full cursor-pointer items-center"
                  onClick={() => setDropdownOpen(false)}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  <span>Visualizar</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link
                  to={`${baseUrl}/${id}/edit`}
                  className="flex w-full cursor-pointer items-center"
                  onClick={() => setDropdownOpen(false)}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  <span>Editar</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <AlertDialog>
                <AlertDialogTrigger>
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive w-full cursor-pointer"
                    onSelect={(e) => {
                      e.preventDefault();
                      // setDropdownOpen(false);
                    }}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    <span>Excluir</span>
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta ação não pode ser desfeita. Isso excluirá
                      permanentemente este item e removerá os dados dos nossos
                      servidores.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>
                      Excluir
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          )}

          {/* Itens personalizados */}
          {customItems && customItems}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
