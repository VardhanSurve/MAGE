// StepTwo.tsx
"use client";
import { useEffect, useState, useTransition } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import * as z from "zod";
import { arrayUnion, doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "@/app/firebase/config";
import { useSession } from "next-auth/react";
import { FormError } from '@/components/form-error';
import { FormSuccess } from '@/components/form-success';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import confetti from "canvas-confetti";
import Image from "next/image";
import { CardBody, CardContainer, CardItem } from "../ui/3d-card";

// Define the form schema using zod for Step 2
const DataLoaderModelSchema = z.object({
  endpointUrl: z.string().optional(), 

  access_key_id:z.string().optional(), 
  secret_access_key_id:z.string().optional(), 
  bucket_name:z.string().optional(), 

  sasUrl: z.string().optional(), 
  connecetion_string:z.string().optional(), 
  container_name:z.string().optional(), 

  google_drive_id:z.string().optional(), 

  ListUrl: z.string().optional(), 

  database_token:z.string().optional(), 
  database_id:z.string().optional(), 
  page_id:z.string().optional(), 
  database_url: z.string().optional(), 
  page_url: z.string().optional(), 
  block_url: z.string().optional(), 

});

// Define props interface
interface StepTwoProps {
  onBack: () => void;
  onNext: () => void;
  step: number; // Add step as a prop
}
interface DataLoaderModels {
    model: string;
    access_key_id?: string;
    secret_access_key_id?: string;
    bucket_name?: string;
    sasUrl?: string;
    connecetion_string?:string;
    container_name?: string;
    google_drive_id?: string;
    ListUrl?: string;
    database_token?: string;
    database_id?: string;
    page_id?: string;
    database_url?: string;
    page_url?: string;
    block_url?: string;
  }

const SteThree: React.FC<StepTwoProps> = ({ onBack, onNext, step }) => {
  const { data: session } = useSession();
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();
  const [isModelConfigured, setIsModelConfigured] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [embeddingsModels, setEmbeddingsModels] = useState<DataLoaderModels[]>([]);

  const form = useForm<z.infer<typeof DataLoaderModelSchema>>({
    resolver: zodResolver(DataLoaderModelSchema),
    defaultValues: {
      access_key_id: "",
      secret_access_key_id: "",
      bucket_name: "",
      sasUrl: "",
      connecetion_string: "",
      container_name: "",
      google_drive_id: "",
      ListUrl: "",
      database_token: "",
      database_id: "",
      page_id: "",
      database_url: "",
      page_url: "",
      block_url: "",
    },
  });
  // Fetch existing embedding models on mount
  useEffect(() => {
    const fetchDataLoaderModels = async () => {
        if (!session?.user?.id) return;

        const adminRef = doc(db, "retailers", session.user.id);
        const adminSnap = await getDoc(adminRef);

        if (adminSnap.exists()) {
            const data = adminSnap.data();
            // Ensure vectorModels is safely accessed
            if (data.dataLoaderModels?.length > 0) {
                setIsModelConfigured(true);
                setEmbeddingsModels(data.dataLoaderModels);
            }
        }
    };

    fetchDataLoaderModels();
}, [session]);

const onSubmit: SubmitHandler<z.infer<typeof DataLoaderModelSchema>> = async (data) => {
  setError("");
  setSuccess("");

  if (!session?.user?.id) return;

  if (!selectedModel) {
    setError("Please select a model before submitting the form.");
    return;
  }

  const adminRef = doc(db, "retailers", session.user.id);

  const filteredData = {
    endpointUrl: data.endpointUrl?.trim() || undefined,
    access_key_id: data.access_key_id || undefined,
    secret_access_key_id: data.secret_access_key_id || undefined,
    bucket_name: data.bucket_name || undefined,
    sasUrl: data.sasUrl || undefined,
    connecetion_string: data.connecetion_string || undefined,
    container_name: data.container_name || undefined,
    google_drive_id: data.google_drive_id || undefined,
    ListUrl: data.ListUrl || undefined,
    database_token: data.database_token || undefined,
    database_id: data.database_id || undefined,
    page_id: data.page_id || undefined,
    database_url: data.database_url || undefined,
    page_url: data.page_url || undefined,
    block_url: data.block_url || undefined,
  };

  // Remove fields that are undefined
  const modelData = Object.fromEntries(
    Object.entries(filteredData).filter(([_, value]) => value !== undefined)
  );

  try {
    await updateDoc(adminRef, {
      dataLoaderModels: arrayUnion({
        ...modelData,
        storage: selectedModel, // Store the selected model here
      }),
    });

    setSuccess("Model configured successfully!");
    setIsModelConfigured(true);
  } catch (error) {
    setError("An error occurred while configuring the model.");
    console.error("Error updating document: ", error);
  }
};

  const handleFinalSubmit = () => {
    // Trigger the confetti effect
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 50 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval = window.setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);

    // Call the onNext function after confetti is triggered
    onNext();
  };

  const handleDeleteModel = async () => {
    if (!session?.user?.id) return;

    const adminRef = doc(db, "retailers", session.user.id);

    // Clear the entire vectorModels array
    await updateDoc(adminRef, {
      dataLoaderModels: [],
    });

    // Update the local state to reflect the deletion
    setEmbeddingsModels([]); // Reset vector models after deletion
    setIsModelConfigured(false); // Mark the model as not configured
    setSelectedModel(null); // Clear the selected model
  };
  
  return (
<div className="flex flex-row w-[85rem] h-[90rem]" >
<div className="flex flex-col mt-[5rem] min-h-[50rem] w-[20rem] space-y-4">
        <Button variant="outline" disabled={isModelConfigured} className="dark:text-white border-white  px-8 py-0.5">
          Vector Index
        </Button>
        <Button variant="outline" disabled={isModelConfigured} className="dark:text-white border-white px-8 py-0.5">
        Embedding Models
        </Button>
        <Button variant="outline" className={step === 4 ? "px-8 py-0.5 dark:bg-black dark:text-white  border-2 border-black dark:border-white uppercase bg-white text-black transition duration-200 text-sm shadow-[1px_1px_rgba(0,0,0),2px_2px_rgba(0,0,0),3px_3px_rgba(0,0,0),4px_4px_rgba(0,0,0),5px_5px_0px_0px_rgba(0,0,0)] dark:shadow-[1px_1px_rgba(255,255,255),2px_2px_rgba(255,255,255),3px_3px_rgba(255,255,255),4px_4px_rgba(255,255,255),5px_5px_0px_0px_rgba(255,255,255)]" : ""}>
          Data Loaders
        </Button>
      </div>

      <div className="flex-1 dark:bg-muted bg-gray-100 p-8 rounded-lg ml-4">
        <h3 className="text-2xl mb-4 pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-black to-gray-400 bg-clip-text text-center font-semibold leading-none text-transparent dark:from-white dark:to-[#928a92]">Choose an Embedding Model</h3>
        <div className="grid grid-cols-3 gap-4">
          {["AWS", "Azure", "Google", "URL loader","Notion"].map((model) => (
            <div key={model}>
              <Dialog>
                      <DialogTrigger asChild>
                      <div onClick={() => setSelectedModel(model)}>
      <CardContainer>  
        <CardBody
          className={`bg-white mt-5 w-[20rem] h-[20rem] group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] shadow-lg rounded-lg flex flex-col justify-center items-center cursor-pointer border border-gray-300 ${isModelConfigured ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {/* Card Image */}
          <CardItem
            translateZ="100"
            rotateX={20}
            rotateZ={-10}
            className="w-full mt-4"
            style={{ width: '100%', height: '150px', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}
          >
            <Image
              src={`/images/${model.toLowerCase()}.png`}
              alt={model}
              className="object-contain" 
              width={100}
              height={100}
              style={{ maxWidth: '100%', maxHeight: '100%', borderRadius: '8px' }}
            />
          </CardItem>

          {/* Card Title */}
          <CardItem
            as="p"
            translateZ="60"
            className="text-center w-[50%] border-t-2 border-black mt-4 text-lg font-semibold"
          >
            {model}
          </CardItem>
        </CardBody>
      </CardContainer>
    </div>


                      </DialogTrigger>

                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>{`Configure ${model}`}</DialogTitle>
                        </DialogHeader>
                        <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                          <div className="space-y-4">
                          {selectedModel === "AWS" && (
                       <div className="space-y-4">

          <FormField
            control={form.control}
            name="access_key_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Enter Access Key Id</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPending}
                    placeholder="***********"
                    type="text"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="secret_access_key_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Enter Secret access key</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPending}
                    placeholder="********"
                    type="password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
          control={form.control}
          name="bucket_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Enter Bucket Name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  disabled={isPending}
                  placeholder="sekiro"
                  type="text"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        </div>
        )}

{selectedModel === "Azure" && (
                       <div className="space-y-4">

          <FormField
            control={form.control}
            name="sasUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Enter Sass Url</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPending}
                    placeholder="https://shadcnui.com"
                    type="url"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="connecetion_string"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Enter Connection String</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPending}
                    placeholder="locococ"
                    type="text"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
          control={form.control}
          name="container_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Enter Container Name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  disabled={isPending}
                  placeholder="sekiro"
                  type="text"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        </div>
        )}

{selectedModel === "Google" && (
                       <div className="space-y-4">
          <FormField
          control={form.control}
          name="google_drive_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Enter Drive Id</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  disabled={isPending}
                  placeholder="sekiro12"
                  type="text"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        </div>
        )}
        {selectedModel === "URL loader" && (
                       <div className="space-y-4">
          <FormField
          control={form.control}
          name="ListUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Enter List Url</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  disabled={isPending}
                  placeholder="https://hahs.com"
                  type="url"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        </div>
        )}

{selectedModel === "Notion" && (
                       <div className="space-y-4">

          <FormField
            control={form.control}
            name="database_token"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Integration Token</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPending}
                    placeholder="********"
                    type="password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="database_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Enter DatabaseId</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPending}
                    placeholder="423dsad3213"
                    type="text"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
          control={form.control}
          name="page_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Enter Page Id</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  disabled={isPending}
                  placeholder="sekiro"
                  type="text"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="database_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Enter DataBase url</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  disabled={isPending}
                  placeholder="https://sekiro.cpm"
                  type="url"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="page_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Enter Page Url</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  disabled={isPending}
                  placeholder="https://sekiro.com"
                  type="url"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="block_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Enter Block Url</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  disabled={isPending}
                  placeholder="https://sekiro.com"
                  type="url"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        </div>
        )}
                          </div>

                          <div className="mt-4">
                          <FormError message={error} />
                          <FormSuccess message={success} />
                            <Button type="submit" variant="outline" disabled={isModelConfigured}>
                              Submit
                            </Button>
                          </div>
                        </form>
                        </Form>
                      </DialogContent>
                    </Dialog>
            </div>
          ))}
        </div>
                          {isModelConfigured && (
                <div className="mt-4">
                  <Button onClick={handleDeleteModel} variant="default" className=" dark:hover:shadow-white px-8 py-2 hover:bg-red-500  rounded-md border bg-red-500 border-black  dark:text-black text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200 text-black">
                    Reset Vector Model
                  </Button>
                </div>
              )}
        <div className="mt-4 flex justify-between">
          <Button onClick={onBack}  variant="outline" className="  px-8 py-2 dark:shadow-white  rounded-md border bg-white border-black dark:bg-white dark:text-black text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200 text-black">Back</Button>
          <Button onClick={handleFinalSubmit}  disabled={!isModelConfigured} variant="outline" className="  px-8 py-2  dark:shadow-white rounded-md border bg-white border-black dark:bg-white dark:text-black text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200 text-black">Final Submit</Button>
        </div>
      </div>
    </div>
  );
}

export default SteThree;
