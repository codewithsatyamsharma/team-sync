import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useEmployee } from "../../hooks/useEmployees";
import EmployeeHeader from "../components/employees/EmployeeHeader";
import EmployeeStats from "../components/employees/EmployeeStats";
import SearchFilterBar from "../components/employees/SearchFilterBar";
import EmployeeTable from "../components/employees/EmployeeTable";
import Pagination from "../components/employees/Pagination";
import { updateEmployee } from "../../api/employeeApis";

const Employee = () => {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});
  const [error, setError] = useState("");
  let {
    data,
    isPending,
    handlePageChange,
    isFetching,
    filters,
    handleSearchFilters,
  } = useEmployee();

  const startEdit = (employee) => {
    setEditing(employee);
    setForm({ name: employee.name, department: employee.department, role: employee.role, status: employee.status, bio: employee.bio || "" });
    setError("");
  };
  const update = async (employee, changes) => {
    try { await updateEmployee(employee._id, changes); await queryClient.invalidateQueries({ queryKey: ["employees"] }); setEditing(null); setError(""); }
    catch (e) { setError(e.response?.data?.message || "Employee could not be updated."); }
  };
  const save = async (event) => { event.preventDefault(); await update(editing, form); };

  if (isPending) return <h1>Loading..</h1>;

  return (
    <div className="min-h-screen bg-[var(--bg-main)] p-8">
      <div className=" mx-auto">
        {/* HEADER */}
        <EmployeeHeader />

        {/* STATS */}
        <EmployeeStats employees={data?.employees} total={data?.pagination?.total} />

        {/* TABLE SECTION */}
        <div className="mt-8 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-3xl overflow-hidden">
          <SearchFilterBar
            filters={filters}
            handleSearchFilters={handleSearchFilters}
          />

          {isFetching && <h1>Loading next page data</h1>}

          <EmployeeTable employees={data?.employees} onEdit={startEdit} onInactive={update} />

          <Pagination
            pagination={data?.pagination}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
      {editing && <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4"><form onSubmit={save} className="w-full max-w-lg space-y-4 rounded-2xl border border-white/10 bg-[var(--bg-surface)] p-6"><h2 className="text-xl font-semibold">Update employee</h2>{["name","department","role","status","bio"].map((field)=><label key={field} className="block text-sm capitalize">{field}<input required={field!=="bio"} className="mt-1 w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-[var(--text-primary)]" value={form[field]??""} onChange={e=>setForm({...form,[field]:e.target.value})}/></label>)}{error&&<p role="alert" className="text-sm text-red-300">{error}</p>}<div className="flex justify-end gap-2"><button type="button" onClick={()=>setEditing(null)} className="rounded-lg border border-white/10 px-4 py-2">Cancel</button><button className="rounded-lg bg-purple-600 px-4 py-2 font-semibold">Save changes</button></div></form></div>}
    </div>
  );
};

export default Employee;
