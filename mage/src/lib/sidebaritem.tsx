import { FaCube, FaArrowsAltH, FaPaperclip, FaCog, FaChartBar, FaTasks, FaUser  } from 'react-icons/fa';
// Define the types for the sidebar item

type FieldType = 'text' | 'dropdown' | 'range';

type SidebarContent = {
  id:string;
  name: string;
  title?:string;
  requiredFields: { 
    fieldName: string;
    fieldType?: FieldType; // Field type could be text, dropdown or range
    isDropdown?: boolean; 
    options?: string[]; // For dropdown options
    min?: number; // Min value for range
    max?: number; // Max value for range
    step?: number; // Step value for range
  }[];
};

// Define the type for the whole menu item
type SidebarItem = {
  title: string;
  icon: JSX.Element;
  content: SidebarContent[];
};

export const menuItems: SidebarItem[] = [
  {
    title: "Inputs",
    icon: <FaCube />,
    content: [
      { id: "chat-input", name: "Chat Input", requiredFields: [{ fieldName: "API Key", fieldType: 'text' }, { fieldName: "Name", fieldType: 'text' }] },
      { id: "text-input", name: "Text Input", requiredFields: [{ fieldName: "ID", fieldType: 'text' }, { fieldName: "Secret Key", fieldType: 'text' }] }
    ]
  },
  {
    title: "Outputs",
    icon: <FaArrowsAltH />,
    content: [
      { id: "chat-output", name: "Chat Output", requiredFields: [{ fieldName: "API Key", fieldType: 'text' }, { fieldName: "ID", fieldType: 'text' }] },
      { id: "text-output", name: "Text Output", requiredFields: [{ fieldName: "Name", fieldType: 'text' }, { fieldName: "Password", fieldType: 'text' }] }
    ]
  },
  {
    title: "Tools",
    icon: <FaPaperclip />,
    content: [
      { id: "prompt", name: "Prompt", requiredFields: [{ fieldName: "Secret Key", fieldType: 'text' }] }
    ]
  },
  {
    title: "Prompts",
    icon: <FaPaperclip />,
    content: [
      { id: "prompt", name: "Prompt", requiredFields: [{ fieldName: "Secret Key", fieldType: 'text' }] }
    ]
  },
  {
    title: "Data",
    icon: <FaCube />,
    content: [
      { id: "AWS", name: "AWS", requiredFields: [{ fieldName: "AWS ACCESS KEY ID", fieldType: 'text' }, { fieldName: "AWS SECRET ACCESS KEY", fieldType: 'text' },{ fieldName: "AWS BUCKET NAME", fieldType: 'text' }] },
      { id: "directory", name: "Directory", requiredFields: [{ fieldName: "ID", fieldType: 'text' }, { fieldName: "Secret Key", fieldType: 'range', min: 0, max: 100, step: 1 }] },
      { id: "file", name: "File", requiredFields: [{ fieldName: "Name", fieldType: 'text' }, { fieldName: "File Path", fieldType: 'text' }] },
      { id: "sql-query", name: "SQL Query", requiredFields: [{ fieldName: "Query", fieldType: 'text' }, { fieldName: "API Key", fieldType: 'text' }] },
      { id: "url", name: "URL", requiredFields: [{ fieldName: "API Key", fieldType: 'text' }, { fieldName: "Endpoint", fieldType: 'text' }] },
      { id: "webhook", name: "Webhook", requiredFields: [{ fieldName: "Secret Key", fieldType: 'text' }, { fieldName: "URL", fieldType: 'text' }] }
    ]
  },
  {
    title: "Processing",
    icon: <FaArrowsAltH />,
    content: [
      { id: "combine-text", name: "Combine Text", requiredFields: [{ fieldName: "Text1", fieldType: 'text' }, { fieldName: "Text2", fieldType: 'text' }] },
      { id: "filter-data", name: "Filter Data", requiredFields: [{ fieldName: "Data", fieldType: 'text' }, { fieldName: "Filter Conditions", fieldType: 'dropdown', isDropdown: true, options: ["Condition1", "Condition2"] }] },
      { id: "filter-values", name: "Filter Values", requiredFields: [{ fieldName: "Value", fieldType: 'text' }, { fieldName: "Condition", fieldType: 'dropdown', isDropdown: true, options: ["Eq", "Ne", "Lt", "Gt"] }] },
      { id: "json-cleaner", name: "JSON Cleaner", requiredFields: [{ fieldName: "JSON Input", fieldType: 'text' }] },
      { id: "merge-data", name: "Merge Data", requiredFields: [{ fieldName: "Data1", fieldType: 'text' }, { fieldName: "Data2", fieldType: 'text' }] },
      { id: "parse-data", name: "Parse Data", requiredFields: [{ fieldName: "Data Format", fieldType: 'text' }] },
      { id: "split-text", name: "Split Text", requiredFields: [{ fieldName: "Text", fieldType: 'text' }, { fieldName: "Separator", fieldType: 'text' }] },
      { id: "update-data", name: "Update Data", requiredFields: [{ fieldName: "Old Value", fieldType: 'text' }, { fieldName: "New Value", fieldType: 'text' }] }
    ]
  },
  {
    title: "Models",
    icon: <FaCube />,
    content: [
      { id: "aiml", name: "AIML", requiredFields: [{ fieldName: "Model Name", fieldType: 'text' }, { fieldName: "API Key", fieldType: 'text' }] },
      { id: "amazon-bedrock", name: "Amazon Bedrock", requiredFields: [{ fieldName: "API Key", fieldType: 'text' }, { fieldName: "Model ID", fieldType: 'text' }] },
      { id: "anthropic", name: "Anthropic", requiredFields: [{ fieldName: "API Key", fieldType: 'text' }] },
      { id: "azure-openai", name: "Azure OpenAI", requiredFields: [{ fieldName: "API Key", fieldType: 'text' }, { fieldName: "Subscription ID", fieldType: 'text' }] },
      { id: "cohere", name: "Cohere", requiredFields: [{ fieldName: "API Key", fieldType: 'text' }] },
      { id: "google-gen-ai", name: "Google Gen AI", requiredFields: [{ fieldName: "API Key", fieldType: 'text' }] },
      { id: "groq", name: "Groq", requiredFields: [{ fieldName: "API Key", fieldType: 'text' }, { fieldName: "Model ID", fieldType: 'text' }] },
      { id: "hugging-face", name: "Hugging Face", requiredFields: [{ fieldName: "API Key", fieldType: 'text' }, { fieldName: "Model Name", fieldType: 'text' }] },
      { id: "lm-studio", name: "LM Studio", requiredFields: [{ fieldName: "Model Key", fieldType: 'text' }, { fieldName: "ID", fieldType: 'text' }] },
      { id: "maritalk", name: "Maritalk", requiredFields: [{ fieldName: "API Key", fieldType: 'text' }, { fieldName: "Region", fieldType: 'text' }] },
      { id: "mistralai", name: "MistralAI", requiredFields: [{ fieldName: "Model Key", fieldType: 'text' }] },
      { id: "nvidia", name: "NVDIA", requiredFields: [{ fieldName: "API Key", fieldType: 'text' }] },
      { id: "ollama", name: "Ollama", requiredFields: [{ fieldName: "API Key", fieldType: 'text' }, { fieldName: "Model", fieldType: 'text' }] },
      { id: "openai", name: "OpenAI", requiredFields: [{ fieldName: "API Key", fieldType: 'text' }, { fieldName: "Secret Key", fieldType: 'text' }] },
      { id: "perplexity", name: "Perplexity", requiredFields: [{ fieldName: "API Key", fieldType: 'text' }] },
      { id: "qianfan", name: "Qianfan", requiredFields: [{ fieldName: "API Key", fieldType: 'text' }] },
      { id: "vertex-ai", name: "Vertex AI", requiredFields: [{ fieldName: "API Key", fieldType: 'text' }, { fieldName: "Region", fieldType: 'text' }] }
    ]
  },
  {
    title: "Vector Stores",
    icon: <FaCube />,
    content: [
      { id: "astra-db", name: "Astra DB", requiredFields: [{ fieldName: "API Key", fieldType: 'text' }, { fieldName: "Cluster ID", fieldType: 'text' }] },
      { id: "astra-db-graph", name: "Astra DB Graph", requiredFields: [{ fieldName: "API Key", fieldType: 'text' }] }
    ]
  },
  {
    title: "Actions",
    icon: <FaChartBar />,
    content: [
      { id: "analysis", name: "Analysis", requiredFields: [{ fieldName: "API Key", fieldType: 'text' }, { fieldName: "ID", fieldType: 'text' }] },
      { id: "debug", name: "Debug", requiredFields: [{ fieldName: "Error Code", fieldType: 'text' }] },
      { id: "logs", name: "Logs", requiredFields: [{ fieldName: "Log ID", fieldType: 'text' }] }
    ]
  },
  {
    title: "Configuration",
    icon: <FaCog />,
    content: [
      { id: "secret-key", name: "Secret Key", requiredFields: [{ fieldName: "Key", fieldType: 'text' }, { fieldName: "Value", fieldType: 'text' }] },
      { id: "workflow", name: "Workflow", requiredFields: [{ fieldName: "Workflow ID", fieldType: 'text' }] }
    ]
  },
  {
    title: "Profile",
    icon: <FaUser />,
    content: [
      { id: "user-profile", name: "User Profile", requiredFields: [{ fieldName: "Username", fieldType: 'text' }, { fieldName: "Email", fieldType: 'text' }] }
    ]
  }
];

export const RetailItems: SidebarContent[] = [
  {
    id: "chat-input",
    title: "Chat Input",
    name: "Chat Input",
    requiredFields: [
      { fieldName: "API Key", fieldType: "text" },
      { fieldName: "Name", fieldType: "text" },
    ],
  },
  {
    id: "prompt",
    title: "Prompt",
    name: "Prompt",
    requiredFields: [{ fieldName: "Secret Key", fieldType: "text" }],
  },
  {
    id: "api-request",
    title: "API Request",
    name: "API Request",
    requiredFields: [
      { fieldName: "API Key", fieldType: "text" },
      { fieldName: "URL", fieldType: "text" },
    ],
  },
  {
    id: "filter-values",
    title: "Filter Values",
    name: "Filter Values",
    requiredFields: [
      { fieldName: "Value", fieldType: "text" },
      {
        fieldName: "Condition",
        fieldType: "dropdown",
        isDropdown: true,
        options: ["Eq", "Ne", "Lt", "Gt"],
      },
    ],
  },
  {
    id: "astra-db",
    title: "Astra DB",
    name: "Astra DB",
    requiredFields: [
      { fieldName: "API Key", fieldType: "text" },
      { fieldName: "Cluster ID", fieldType: "text" },
    ],
  },
];


export const SponerItems: SidebarContent[] = [
  {
    id: "chat-input",
    title: "Chat Input",
    name: "Chat Input",
    requiredFields: [
      { fieldName: "Name", fieldType: "text" },
    ],
  },
  {
    id: "api-request",
    title: "API Request",
    name: "API Request",
    requiredFields: [
      { fieldName: "URL", fieldType: "text" },
    ],
  },
  {
    id: "astra-db",
    title: "Astra DB",
    name: "Astra DB",
    requiredFields: [
      { fieldName: "Cluster ID", fieldType: "text" },
    ],
  },
];
export  const menuItems2 = [
    { title: "Langchain", icon: <FaCog />, content: ["Overview", "Stats", "Reports"] },
    { title: "AssemblyAI", icon: <FaChartBar />, content: ["Active", "Archived", "New"] },
    { title: "DataStax", icon: <FaTasks />, content: ["My Tasks", "Team Tasks", "Completed"] },
    { title: "Notion", icon: <FaUser />, content: ["Profile", "Account", "Preferences"] },
    { title: "Google", icon: <FaTasks />, content: ["My Tasks", "Team Tasks", "Completed"] },
    { title: "CrewAI", icon: <FaCog />, content: ["Documentation", "FAQs", "Support"] },
    { title: "NotDiamond", icon: <FaChartBar />, content: ["Overview", "Stats", "Reports"] },
    { title: "Composio", icon: <FaTasks />, content: ["Active", "Archived", "New"] },
    { title: "Firecrawl", icon: <FaUser />, content: ["My Tasks", "Team Tasks", "Completed"] },
    { title: "Unstructured", icon: <FaCog />, content: ["Profile", "Account", "Preferences"] },
    { title: "Git", icon: <FaChartBar />, content: ["Documentation", "FAQs", "Support"] },
    { title: "Confluence", icon: <FaUser />, content: ["Overview", "Stats", "Reports"] },
  ];

  
        
//   <SidebarGroup>
//   <SidebarGroupLabel>Bundles</SidebarGroupLabel>
//   <SidebarGroupContent>
// <SidebarMenu>
//   {menuItems2.map((item, index) => (
//     <Collapsible key={index} defaultOpen={false} className="group/collapsible">
//       <SidebarMenuItem>
//         <CollapsibleTrigger asChild>
//         <SidebarMenuButton>
//               {/* Left side icon */}
//               <span className="mr-2">{item.icon}</span>
//               {item.title}
//               {/* Right side dropdown icon */}
//               <span className="ml-auto">
//                 <FaChevronDown />
//               </span>
//             </SidebarMenuButton>
//         </CollapsibleTrigger>
//         <CollapsibleContent>
//           <SidebarMenuSub>
//           {item.content.map((subItem, subIndex) => (
//                 <SidebarMenuSubItem key={subIndex} className="flex bg-gray-700 p-2 rounded-lg justify-between">
//                   <span>{subItem}</span>
//                   {/* Plus icon on the right side of the content */}
//                   <FaPlus />
//                 </SidebarMenuSubItem>
//               ))}
//           </SidebarMenuSub>
//         </CollapsibleContent>
//       </SidebarMenuItem>
//     </Collapsible>
//   ))}
// </SidebarMenu>
// </SidebarGroupContent>
// </SidebarGroup>