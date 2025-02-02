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
import Image from "next/image";
import { CardBody, CardContainer, CardItem } from "../ui/3d-card";

// Define the form schema using zod for Step 2
const EmbeddingModelSchema = z.object({
  apiKey: z.string().min(1, "API Key is required"),
});

// Define props interface
interface StepTwoProps {
  onBack: () => void;
  onNext: () => void;
  step: number; // Add step as a prop
}
interface embeddingModels {
    model: string;
    apiKey: string;
    storage: string; // Add this line to include the storage property
  }

const SteTwo: React.FC<StepTwoProps> = ({ onBack, onNext, step }) => {
  const { data: session } = useSession();
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();
  const [isModelConfigured, setIsModelConfigured] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [embeddingsModels, setEmbeddingsModels] = useState<embeddingModels[]>([]);

  const form = useForm<z.infer<typeof EmbeddingModelSchema>>({
    resolver: zodResolver(EmbeddingModelSchema),
    defaultValues: {
      apiKey: "",
    },
  });


  // Fetch existing embedding models on mount
  useEffect(() => {
    const fetchEmbeddingModels = async () => {
      if (!session?.user?.id) return;

      const adminRef = doc(db, "retailers", session.user.id);
      const adminSnap = await getDoc(adminRef);
      if (adminSnap.exists()) {
        const data = adminSnap.data();
        // Ensure vectorModels is safely accessed
        if (data.vectorModels?.length > 0) {
            setIsModelConfigured(true);
            setEmbeddingsModels(data.vectorModels);
        }
    }
    };

    fetchEmbeddingModels();
  }, [session]);

  const onSubmit: SubmitHandler<z.infer<typeof EmbeddingModelSchema>> = async (data) => {
    setError("");
    setSuccess("");

    if (!session?.user?.id) return;
    if (!selectedModel) {
      setError("Please select a model before submitting the form.");
      return;
    }
    const adminRef = doc(db, "retailers", session.user.id);
    startTransition(async () => {
    try {
      await updateDoc(adminRef, {
        embeddingModels: arrayUnion({
          apiKey: data.apiKey,
          storage: selectedModel, // Store the selected model here
        }),
      });

      setSuccess("Model configured successfully!");
      setIsModelConfigured(true);
    } catch (error) {
      setError("An error occurred while configuring the model.");
      console.error("Error updating document: ", error);
    }
    });
  };
  const handleDeleteModel = async () => {
    if (!session?.user?.id) return;

    const adminRef = doc(db, "retailers", session.user.id);

    // Clear the entire vectorModels array
    await updateDoc(adminRef, {
    embeddingModels: [],
    });

    // Update the local state to reflect the deletion
    setEmbeddingsModels([]); // Reset vector models after deletion
    setIsModelConfigured(false); // Mark the model as not configured
    setSelectedModel(null); // Clear the selected model
  };
  const isModelSaved = (model: string) => {
    const isSaved = embeddingsModels.some((m) => m.storage === model);
    console.log(`Is model ${model} saved?`, isSaved); // Debugging log
    return isSaved;
  };
  
  return (
    <div className="flex flex-row w-[85rem] h-[50rem]" >
            <div className="flex flex-col mt-[5rem] min-h-[50rem] w-[20rem] space-y-4">
        <Button variant="outline" disabled={isModelConfigured} className="dark:text-white border-white px-8 py-0.5">
          Vector Index
        </Button>
        <Button variant="outline" className={step === 3 ? " px-8 py-0.5  dark:bg-black dark:text-white  border-2 border-black dark:border-white uppercase bg-white text-black transition duration-200 text-sm shadow-[1px_1px_rgba(0,0,0),2px_2px_rgba(0,0,0),3px_3px_rgba(0,0,0),4px_4px_rgba(0,0,0),5px_5px_0px_0px_rgba(0,0,0)] dark:shadow-[1px_1px_rgba(255,255,255),2px_2px_rgba(255,255,255),3px_3px_rgba(255,255,255),4px_4px_rgba(255,255,255),5px_5px_0px_0px_rgba(255,255,255)]" : ""}>
        Embedding Models
        </Button>
        <Button variant="outline" disabled={isModelConfigured} className="dark:text-white border-white px-8 py-0.5">
        Data Loaders
        </Button>
      </div>

      <div className="flex-1 dark:bg-muted bg-gray-100 p-8 rounded-lg ml-4">
        <h3 className="text-2xl mt-2 mb-4 pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-black to-gray-400 bg-clip-text text-center font-semibold leading-none text-transparent dark:from-white dark:to-[#928a92]">Choose an Embedding Model</h3>
        <div className="grid grid-cols-2 gap-4">
          {["Open AI", "Cohere"].map((model) => (
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
              src={`/emb/${model.toLowerCase()}.png`}
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
            className="text-center border-t-2 dark:border-t-black w-[50%] border-t-black mt-4 text-lg font-semibold"
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
                            <FormField
                            control={form.control}
                            name="apiKey"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Enter API Key</FormLabel>
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
                  <Button onClick={handleDeleteModel} variant="default" className="  px-8 py-2 dark:shadow-white  rounded-md border hover:bg-red-500 bg-red-500 border-black  dark:text-black text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200 text-black">
                    Reset Vector Model
                  </Button>
                </div>
              )}
        <div className="mt-4 flex justify-between">
          <Button onClick={onBack}  variant="outline" className="  px-8 py-2 dark:shadow-white rounded-md border bg-white border-black dark:bg-white dark:text-black text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200 text-black">Back</Button>
          <Button onClick={onNext} disabled={!isModelConfigured} variant="outline" className="  px-8 py-2 dark:shadow-white rounded-md border bg-white border-black dark:bg-white dark:text-black text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200 text-black">Next</Button>
        </div>
      </div>
    </div>
  );
}

export default SteTwo;
