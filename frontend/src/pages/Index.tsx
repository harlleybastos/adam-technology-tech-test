import { useState } from "react";
import { RoleSelector } from "@/components/RoleSelector";
import { PainterDashboard } from "@/components/painter/PainterDashboard";
import { CustomerDashboard } from "@/components/customer/CustomerDashboard";
import { UserRole } from "@/types";

const Index = () => {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
  };

  const handleRoleChange = (role: UserRole | null) => {
    setSelectedRole(role);
  };

  if (selectedRole === 'painter') {
    return <PainterDashboard onRoleChange={handleRoleChange} />;
  }

  if (selectedRole === 'customer') {
    return <CustomerDashboard onRoleChange={handleRoleChange} />;
  }

  return <RoleSelector onRoleSelect={handleRoleSelect} />;
};

export default Index;
