import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import NotFound from "@/pages/not-found";
import Landing from "@/pages/public/Landing";
import Pricing from "@/pages/public/Pricing";
import Login from "@/pages/public/Login";
import RegisterWizard from "@/pages/public/RegisterWizard";
import FAQ from "@/pages/public/FAQ";
import Paywall from "@/pages/public/Paywall";
import EntrepreneurDashboard from "@/pages/entrepreneur/Dashboard";
import Catalog from "@/pages/entrepreneur/Catalog";
import Groups from "@/pages/entrepreneur/Groups";
import Wallet from "@/pages/entrepreneur/Wallet";
import Schedules from "@/pages/entrepreneur/Schedules";
import SendHistory from "@/pages/entrepreneur/SendHistory";
import Commissions from "@/pages/entrepreneur/Commissions";
import EntrepreneurCollaborators from "@/pages/entrepreneur/Collaborators";
import EntrepreneurSettings from "@/pages/entrepreneur/Settings";
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminOffers from "@/pages/admin/Offers";
import AdminEntrepreneurs from "@/pages/admin/Entrepreneurs";
import AdminCommissions from "@/pages/admin/Commissions";
import AdminWithdrawals from "@/pages/admin/Withdrawals";
import AdminSubscriptions from "@/pages/admin/Subscriptions";
import AdminMarketplaces from "@/pages/admin/Marketplaces";
import CollaboratorDashboard from "@/pages/collaborator/Dashboard";
import CollaboratorGroups from "@/pages/collaborator/Groups";
import CollaboratorSendHistory from "@/pages/collaborator/SendHistory";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/precos" component={Pricing} />
      <Route path="/login" component={Login} />
      <Route path="/cadastro" component={RegisterWizard} />
      <Route path="/faq" component={FAQ} />
      <Route path="/paywall" component={Paywall} />

      <Route path="/dashboard" component={EntrepreneurDashboard} />
      <Route path="/dashboard/catalogo" component={Catalog} />
      <Route path="/dashboard/grupos" component={Groups} />
      <Route path="/dashboard/carteira" component={Wallet} />
      <Route path="/dashboard/agendamentos" component={Schedules} />
      <Route path="/dashboard/historico" component={SendHistory} />
      <Route path="/dashboard/comissoes" component={Commissions} />
      <Route path="/dashboard/colaboradores" component={EntrepreneurCollaborators} />
      <Route path="/dashboard/configuracoes" component={EntrepreneurSettings} />

      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/ofertas" component={AdminOffers} />
      <Route path="/admin/empreendedores" component={AdminEntrepreneurs} />
      <Route path="/admin/comissoes" component={AdminCommissions} />
      <Route path="/admin/saques" component={AdminWithdrawals} />
      <Route path="/admin/assinaturas" component={AdminSubscriptions} />
      <Route path="/admin/marketplaces" component={AdminMarketplaces} />

      <Route path="/collaborator" component={CollaboratorDashboard} />
      <Route path="/collaborator/grupos" component={CollaboratorGroups} />
      <Route path="/collaborator/historico" component={CollaboratorSendHistory} />

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
