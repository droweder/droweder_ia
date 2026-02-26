import React from 'react';
import { MoreHorizontal, Plus, Search, Building2 } from 'lucide-react';

const Companies: React.FC = () => {
  const companies = [
    { id: 1, name: 'Planintex Corp', plan: 'Enterprise', status: 'Active', users: 12, spent: 'R$ 450.00' },
    { id: 2, name: 'Metalúrgica Silva', plan: 'Pro', status: 'Active', users: 5, spent: 'R$ 120.00' },
    { id: 3, name: 'Indústria Beta', plan: 'Starter', status: 'Inactive', users: 2, spent: 'R$ 0.00' },
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 h-full overflow-y-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Gestão de Inquilinos (Tenants)</h1>
          <p className="text-gray-500 mt-1">Super-Admin: Controle central das empresas conectadas.</p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center gap-2">
          <Plus size={18} />
          Nova Empresa
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-4 bg-gray-50/50">
            <div className="relative flex-1 max-w-md">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    placeholder="Buscar empresas..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                />
            </div>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
                    <tr>
                        <th className="px-6 py-3 font-semibold uppercase text-xs tracking-wider">Empresa</th>
                        <th className="px-6 py-3 font-semibold uppercase text-xs tracking-wider">Plano</th>
                        <th className="px-6 py-3 font-semibold uppercase text-xs tracking-wider">Status</th>
                        <th className="px-6 py-3 text-right font-semibold uppercase text-xs tracking-wider">Usuários</th>
                        <th className="px-6 py-3 text-right font-semibold uppercase text-xs tracking-wider">Gasto (Mês)</th>
                        <th className="px-6 py-3 text-center font-semibold uppercase text-xs tracking-wider">Ações</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {companies.map((company) => (
                        <tr key={company.id} className="hover:bg-gray-50 transition-colors group">
                            <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 border border-gray-200">
                                    <Building2 size={16} />
                                </div>
                                {company.name}
                            </td>
                            <td className="px-6 py-4 text-gray-600">
                                <span className="bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full text-xs font-medium border border-indigo-100">{company.plan}</span>
                            </td>
                            <td className="px-6 py-4">
                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${company.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                                    <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${company.status === 'Active' ? 'bg-emerald-500' : 'bg-gray-400'}`}></span>
                                    {company.status === 'Active' ? 'Ativo' : 'Inativo'}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-right text-gray-600">{company.users}</td>
                            <td className="px-6 py-4 text-right font-semibold text-gray-900">{company.spent}</td>
                            <td className="px-6 py-4 text-center">
                                <button className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-lg transition-colors">
                                    <MoreHorizontal size={18} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default Companies;
