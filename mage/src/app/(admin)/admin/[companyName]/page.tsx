'use client'; 
import { db } from "@/app/firebase/config";
import { doc, updateDoc, arrayUnion, onSnapshot, arrayRemove, getDoc, deleteField } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useSession } from "next-auth/react";
import { Button } from '@/components/ui/button';
import Workflowform from "@/components/formm";
import { WorkflowFormSchema } from "@/lib/types";
import { z } from "zod";
import { useRouter } from 'next/navigation'; // Import useRouter
import { BackgroundGradientAnimation } from "@/components/ui/conmbg";
import { toast } from "sonner";
import { FaTrash } from 'react-icons/fa'; // Import FaTrash from react-icons
import AnimatedCircularProgressBar1 from "@/components/ui/animcircle";
import BackdropGradient from "@/components/bggradiant";
import { Separator } from "@/components/ui/separator";
import { Edit2Icon } from "lucide-react";

export default function Home() {
  const [showForm, setShowForm] = useState(false); // Toggle form visibility
  const { data: session } = useSession();
  const [isSaving, setIsSaving] = useState(false);
  const [adminCreateData, setAdminCreateData] = useState<any>({}); // Store adminCreate data
  const router = useRouter(); // Initialize useRouter

  type FormData = z.infer<typeof WorkflowFormSchema>;
  const workflowCount = Object.keys(adminCreateData).length;
  const maxWorkflowCount = 100; // Maximum limit of workflows
  const progressValue = Math.min((workflowCount / maxWorkflowCount) * 100, 100);
  useEffect(() => {
    if (!session?.user?.id) return;

    const adminDocRef = doc(db, "admins", session.user.id);
    const unsubscribe = onSnapshot(adminDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setAdminCreateData(data?.adminCreate || {});
      }
    });

    return () => unsubscribe(); // Clean up listener on unmount
  }, [session?.user?.id]);

  const saveWorkflow = async (formData: FormData) => {
    if (!session?.user?.id || !formData.name) return;
    if (workflowCount >= 100) {
      toast.error("Workflow limit of 100 exceeded. Cannot save more.");
      return;
    }
    setIsSaving(true);
    try {
      const adminDocRef = doc(db, "admins", session.user.id);

      // Save workflow in a dynamic adminCreate.[formData.name] field
      await updateDoc(adminDocRef, {
        [`adminCreate.${formData.name}`]: arrayUnion(),
      });

      toast.success("Workflow saved successfully!");
    } catch (error) {
      console.error("Error saving workflow:", error);
      toast.error("Failed to save workflow.");
    } finally {
      setIsSaving(false);
    }
  };
  const handleStartButtonClick = ( name: string) => {
    router.push(`/${name}`);
  }
    const removeWorkflow = async (workflowName: string) => {
      if (!session?.user?.id) return;
      console.log("Card workflowName to remove:", workflowName);
    
      try {
        const adminDocRef = doc(db, "admins", session.user.id);
        const adminDocSnap = await getDoc(adminDocRef); // Fetch document to get current data
    
        if (adminDocSnap.exists()) {
          const adminData = adminDocSnap.data();
          const selectedWorkflowData = adminData?.adminCreate?.[workflowName];
          
          // Check if the workflow exists
          if (!selectedWorkflowData) {
            toast.error("Workflow not found!");
            return;
          }
    
          console.log("Removing selected workflow data:", selectedWorkflowData);
    
          // Now remove each item from the workflow one by one
          selectedWorkflowData.forEach(async (item: any) => {
            await updateDoc(adminDocRef, {
              [`adminCreate.${workflowName}`]: arrayRemove(item),
            });
          });
    
          // After removing items, now remove the workflow name itself
          await updateDoc(adminDocRef, {
            [`adminCreate.${workflowName}`]: deleteField(), // Delete the workflow field
          });
    
          toast.success("Workflow removed successfully!");
        } else {
          toast.error("Admin document not found!");
        }
      } catch (error) {
        console.error("Error removing workflow:", error);
        toast.error("Failed to remove workflow.");
      }
    };
    
  return (
    <div className="overflow-hidden sched3 flex items-center justify-center min-h-screen">
    
    <div className="h-screen  w-screen flex flex-col items-center justify-start p-4">
    <header className="text-center mb-10">
          <h1 className="text-7xl font-bold text-gradient5 mb-4">
            <span className="text-gradient2">MAGE</span> Dashboard
          </h1>
          <p className="text-lg text-gray-300">
            Manage your workflows efficiently and create workflow to streamline your research tasks.
          </p>
        </header>

      <div className=" absolute top-36 right-10">
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? "Close Form" : "Add Workflow"}
        </Button>
      </div>

      {showForm && (
        <Workflowform
          title="Create Workflow"
          onSubmit={(data) => saveWorkflow(data)} // Pass the form data for saving
          isSaving={isSaving} // Pass saving state
        />
      )}
        <Separator className="mt-10 bg-slate-600 " />
        <div className="flex flex-col md:flex-row justify-around md:w-[80%]  w-full">
        <AnimatedCircularProgressBar1 
        max={100}
        min={0}
        value={progressValue}
        className="mt-4"
        gaugePrimaryColor="rgb(79 70 229)"
        gaugeSecondaryColor="#3E2B50"
      />
      <BackdropGradient className='w-4/12 h-2/6 opacity-90 ' container="flex flex-col items-center">

        <div className="grid grid-row-1 max-h-[600px] overflow-y-auto md:grid-row-2 w-max gap-4 mt-6">
        {/* Loop through the adminCreate data and display each name */}
        {Object.keys(adminCreateData).map((name, index) => (
          <div
  key={index}
  className="card p-4 mr-4 w-[80vw] md:w-[50vw] max-h-[80px] border rounded-lg bg-black/40 border-purple-900 shadow-md relative"
  style={{
    boxShadow: "inset -10px 0 15px rgba(128, 90, 213, 0.7)", // Purple inner shadow
  }}
>            <div className="flex justify-between items-center">
           
              <div className="flex-1">
                <h3 className="text-lg text-gray-200 font-bold">{name}</h3>
              </div>
              <Button 
                variant="outline" 
                className="mr-4 border-white w-max text-gray-200 "
                onClick={() => handleStartButtonClick( name)} // Pass company name and name
              >
                Edit<Edit2Icon className="w-3 h-3 ml-3"/>
              </Button>
              <Button
              variant="destructive"
        onClick={() => removeWorkflow(name)}
        className=" top-2 right-2 text-red-500 hover:text-red-700"
      >
        <FaTrash  className="w-5 h-5" />
      </Button>
            </div>

          </div>
        ))}
      </div>
      </BackdropGradient>
    </div>
    </div>
    </div >
  );
}
