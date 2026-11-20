import { Users, BriefcaseBusiness, Activity, UserPlus } from "lucide-react";
import StatCard from "../StatCard";

const EmployeeStats = ({ employees = [], total = employees.length }) => {
  const activeEmployees = employees.filter((emp) => emp.status === "active");
  const departments = new Set(employees.map((emp) => emp.department).filter(Boolean)).size;
  const monthAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
  const newHires = employees.filter((emp) => new Date(emp.createdAt).getTime() >= monthAgo).length;

  return (
    <div className="grid grid-cols-4 gap-6 mt-8">
      <StatCard
        title="Total Employees"
        value={total}
        icon={<Users />}
        badge="+2.4%"
      />

      <StatCard
        title="Active (current page)"
        value={activeEmployees.length}
        icon={<Activity />}
        badge="82%"
      />

      <StatCard
        title="Departments"
        value={departments}
        icon={<BriefcaseBusiness />}
        badge="Updated"
      />

      <StatCard title="New (last 30 days)" value={newHires} icon={<UserPlus />} badge="Current page" />
    </div>
  );
};

export default EmployeeStats;
