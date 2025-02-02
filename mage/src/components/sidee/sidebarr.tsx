import {
    Sidebar,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubItem,
  } from "../ui/sidebar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible"
import { FaChevronDown, FaPlus } from 'react-icons/fa';
import { menuItems, menuItems2 } from "@/lib/sidebaritem";
import { useCardStore } from "@/lib/zusatnd";

// Define the types for the sidebar item
type SidebarContent = {
  id:string;
  name: string;
  requiredFields: { 
    fieldName: string; 
    isDropdown?: boolean; 
    options?: string[]; // For dropdown field options
  }[];
};


type SidebarItem = {
  title: string;
  icon: JSX.Element;
  content: SidebarContent[];
};
  export function AppSidebar() {
    const addCard = useCardStore((state) => state.addCard);
    const handleAddCard = (content: SidebarContent, title: string) => {
      const card = {
        id:content.id,
        title: title,          // Pass the title
        name: content.name,          // Pass the name
        requiredFields: content.requiredFields,  // Pass the required fields
      };
      
      addCard(card);    
     };
  
    
  
    return (
      <Sidebar className="overflow-y-auto bg-sidebar">
      <SidebarHeader className="font-bold p-6 text-3xl">
      MAGE
      </SidebarHeader>
      <SidebarGroup>
          <SidebarGroupLabel>Components</SidebarGroupLabel>
          <SidebarGroupContent>
      <SidebarMenu>
          {menuItems.map((item, index) => (
            <Collapsible key={index} defaultOpen={false} className="group/collapsible">
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton>
                  <span className="flex items-center">
                        <span className="mr-3">{item.icon}</span>
                        <span>{item.title}</span>
                      </span>
                      <FaChevronDown className="ml-auto group-[.open]:rotate-180 transition-transform" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                  {item.content.map((subItem, subIndex) => (
                        <SidebarMenuSubItem
                          key={subIndex}
                          className="flex bg-gray-700 p-2  rounded-lg justify-between "
                          onClick={() => handleAddCard(subItem, item.title)} // Pass the title of the item to the handler
                        >
                          <span>{subItem.name}</span>
                          <FaPlus className="text-gray-500 cursor-pointer hover:text-white" />
                        </SidebarMenuSubItem>
                      ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          ))}
        </SidebarMenu>
        </SidebarGroupContent>
        </SidebarGroup>
    </Sidebar>
    )
  }
  