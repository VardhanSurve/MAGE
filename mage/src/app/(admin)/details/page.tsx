
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DashboardPAge from './_comp/dashboardPAge';
import PortfolioPage from './_comp/portfolioPAge';

const Page = () => {
  return (
    <div className="flex items-center obsidian-night   justify-center min-h-screen">
      <Tabs defaultValue="account" className="w-[90vw] fixed top-3">
  <TabsList className='ml-10'>
    <TabsTrigger className='' value="account">Dashboard</TabsTrigger>
    <TabsTrigger value="password">Portfolio</TabsTrigger>
  </TabsList>
  <TabsContent value="account">
    <DashboardPAge/>
  </TabsContent>
  <TabsContent value="password">
    <PortfolioPage/>
  </TabsContent>
</Tabs>
      
    </div>
  );
};

export default Page;



