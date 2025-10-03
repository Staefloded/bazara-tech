"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Search, Plus, ChevronDown, MoreVertical, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataTable } from "@/components/table/data-table";
import { useTeamManagement } from "@/hooks/useTeamManagement";
import { Team } from "@/types/team.type";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TeamModal } from "@/module/teams/team-modal";
import { DeleteTeamModal } from "@/module/teams/delete-team-modal";
import { SortDropdown, SortOption } from "@/components/ui/sort-dropdown";

const sortOptions: SortOption<keyof Team>[] = [
  { field: "name", label: "Name" },
  { field: "code", label: "Code" },
  { field: "entity", label: "Entity" },
  { field: "manager", label: "Manager" },
  { field: "createdAt", label: "Created At" },
];

export default function TeamTable() {
  const {
    teams,
    pagination,
    totalPages,
    totalFilteredTeams,
    handleSearch,
    setPagination,
    handleEntityFilter,
    uniqueEntities,
    uniqueManagers,
    loading,
    sortConfig,
    handleSort,
    handleManagerFilter,
    clearFilters,
    filters,
  } = useTeamManagement();

  const [searchValue, setSearchValue] = useState("");
  const [selectedEntity, setSelectedEntity] = useState<string>("all");
  const [selectedManager, setSelectedManager] = useState<string>("all");
  const [rowSelection, setRowSelection] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [teamToDelete, setTeamToDelete] = useState<Team | null>(null);

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    handleSearch(value);
  };

  const handleEntityFilterChange = (entity: string) => {
    const selectedEntity = entity === "all" ? "" : entity;

    setSelectedEntity(selectedEntity);
    handleEntityFilter(selectedEntity);
  };

  const handleManagerFilterChange = (manager: string) => {
    const selectedManager = manager === "all" ? "" : manager;
    setSelectedManager(selectedManager);
    handleManagerFilter(selectedManager);
  };

  const handleCreateTeam = () => {
    setModalMode("create");
    setSelectedTeam(null);
    setIsModalOpen(true);
  };

  const handleEditTeam = (team: Team) => {
    setModalMode("edit");
    setSelectedTeam(team);
    setIsModalOpen(true);
  };

  const handleDeleteTeam = (team: Team) => {
    setTeamToDelete(team);
    setIsDeleteModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTeam(null);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setTeamToDelete(null);
  };

  const columns: ColumnDef<Team>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <input
          type="checkbox"
          className="rounded border-gray-300"
          checked={table.getIsAllPageRowsSelected()}
          onChange={(e) => table.toggleAllPageRowsSelected(e.target.checked)}
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          className="rounded border-gray-300"
          checked={row?.getIsSelected?.() || false}
          onChange={(e) => row?.toggleSelected?.(e.target.checked)}
        />
      ),
      enableSorting: false,
      enableHiding: false,
      size: 20,
    },
    {
      accessorKey: "name",
      header: "Team Name",
      cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
    },
    {
      accessorKey: "code",
      header: "Code",
      cell: ({ row }) => <div className="font-mono text-sm">{row.getValue("code")}</div>,
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => (
        <div className="max-w-[200px] truncate text-sm text-gray-600">
          {row.getValue("description")}
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: "Team Email",
      cell: ({ row }) => <div className="text-sm">{row.getValue("email")}</div>,
    },
    {
      accessorKey: "entity",
      header: "Entity",
      cell: ({ row }) => <div className="text-sm">{row.getValue("entity")}</div>,
    },
    {
      accessorKey: "manager",
      header: "Manager",
      cell: ({ row }) => {
        const manager = row.getValue("manager") as string;
        const initials = manager
          .split(" ")
          .map((name) => name.charAt(0))
          .join("")
          .toUpperCase();

        return (
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white text-xs font-medium">
              {initials}
            </div>
            <span className="text-sm">{manager}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) => {
        const date = row.getValue("createdAt") as Date;
        return <div className="text-sm text-gray-600">{date.toLocaleDateString()}</div>;
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">View More</span>
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <button
                  type="button"
                  className="w-full cursor-pointer"
                  onClick={() => handleEditTeam(row.original)}
                >
                  Edit
                </button>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <button
                  type="button"
                  className="w-full text-red-600 hover:text-red-700 cursor-pointer"
                  onClick={() => handleDeleteTeam(row.original)}
                >
                  Delete
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <div className="mx-auto p-6 bg-white rounded-lg">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Teams</h1>

        {Object.values(filters).some((value) => value) && (
          <button
            className=" text-gray-500 rounded-full border border-gray-300 px-4 py-2 flex items-center gap-2 text-xs font-medium cursor-pointer"
            onClick={clearFilters}
          >
            Clear Filters
            <XCircle className="h-4 w-4" />
          </button>
        )}
      </div>

      <hr className="mt-6 mb-8 border-[#EBEBEB]" />

      <div className="mb-6 flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search by team name or code"
            value={searchValue}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
            aria-label="Search teams by name or code"
            role="searchbox"
          />
        </div>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2" aria-label="Filter by entity">
              {selectedEntity === "all" ? "Entity: All" : `Entity: ${selectedEntity}`}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-64">
            <Select value={selectedEntity || undefined} onValueChange={handleEntityFilterChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select entity" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All Entities</SelectItem>
                {uniqueEntities.map((entity) => (
                  <SelectItem key={entity} value={entity}>
                    {entity}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2" aria-label="More filters">
              More Filters
              <ChevronDown className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64">
            <div className="space-y-4">
              <h4 className="font-medium">Additional Filters</h4>

              <div className="space-y-2">
                <label className="text-sm font-medium">Manager</label>
                <Select value={selectedManager} onValueChange={handleManagerFilterChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select manager" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Managers</SelectItem>
                    {uniqueManagers.map((manager) => (
                      <SelectItem key={manager} value={manager}>
                        {manager}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <SortDropdown<keyof Team>
          sortConfig={sortConfig}
          onSort={handleSort}
          options={sortOptions}
        />

        <Button
          variant="brand"
          className="gap-2"
          onClick={handleCreateTeam}
          aria-label="Create new team"
        >
          <Plus className="h-4 w-4" />
          Create New Team
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={teams}
        isLoading={loading}
        totalPages={totalPages}
        maxPerPage={totalFilteredTeams}
        pagination={pagination}
        setPagination={setPagination}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
      />

      {isModalOpen && (
        <TeamModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          team={selectedTeam}
          mode={modalMode}
          uniqueEntities={uniqueEntities}
          uniqueManagers={uniqueManagers}
        />
      )}

      {isDeleteModalOpen && (
        <DeleteTeamModal
          isOpen={isDeleteModalOpen}
          onClose={handleCloseDeleteModal}
          team={teamToDelete}
        />
      )}
    </div>
  );
}
