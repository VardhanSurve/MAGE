import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/app/firebase/config";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useTheme } from "next-themes";
 import { CardContainer, CardBody, CardItem } from "../ui/3d-card";  // Ensure you are importing all required components

// Define props interface
interface StepTwoProps {
  onNext: () => void;
  step: number;
}

const Steone: React.FC<StepTwoProps> = ({ onNext, step }) => {
  const { data: session } = useSession();
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [submittedCard, setSubmittedCard] = useState<string | null>(null); // Track submitted occupation
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>();
  const { theme } = useTheme();

  // List of occupation options
  const occupations = ["Human Resources", "Legal Counsel", "Product Manager", "Customer Support", "Financial Analyst" ,"Marketing"];

  // Handle card selection
  const handleCardClick = (occupation: string) => {
    setSelectedCard(occupation);
  };

  // Submit the selected occupation to Firebase
  const handleSubmit = async () => {
    if (!session?.user?.id || !selectedCard) return;

    const adminRef = doc(db, "retailers", session.user.id);

    startTransition(async () => {
      try {
        await updateDoc(adminRef, {
          occupation: selectedCard,  // Store selected occupation as 'occupation'
        });

        setSubmittedCard(selectedCard); // Store the submitted occupation
        setSuccess("Occupation saved successfully!");
        setSelectedCard(null); // Reset selection after successful submission
      } catch (error) {
        setError("An error occurred while saving the occupation.");
        console.error("Error updating document: ", error);
      }
    });
  };

  return (
    <div className="flex flex-row w-[85rem] h-full">
      <div className="flex flex-col mt-5 min-h-[50rem] w-[20rem] space-y-4">
        <Button 
          variant="outline" 
          className={step === 1 ? "px-8 py-0.5 dark:bg-black dark:text-white border-2 border-black dark:border-white uppercase bg-white text-black transition duration-200 text-sm shadow-[1px_1px_rgba(0,0,0),2px_2px_rgba(0,0,0),3px_3px_rgba(0,0,0),4px_4px_rgba(0,0,0),5px_5px_0px_0px_rgba(0,0,0)] dark:shadow-[1px_1px_rgba(255,255,255),2px_2px_rgba(255,255,255),3px_3px_rgba(255,255,255),4px_4px_rgba(255,255,255),5px_5px_0px_0px_rgba(255,255,255)]" : ""}>
          Select Occupation
        </Button>
      </div>

      <div className="flex-1 dark:bg-muted bg-gray-100 p-8 rounded-lg ml-4">
        <h3 className="text-2xl dark:text-white mb-4">Choose an Occupation</h3>

        <div className="grid grid-cols-3 gap-7">
          {occupations.map((occupation) => (
            <CardContainer key={occupation}>  {/* Add key prop here */}
              <CardBody
                className={`bg-white w-[20rem] h-[20rem] group/card  dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] shadow-lg rounded-lg flex flex-col justify-center items-center cursor-pointer border border-gray-300 ${
                  selectedCard === occupation || submittedCard === occupation ? "bg-green-200" : "bg-white"
                }`}
                onClick={() => handleCardClick(occupation)}
              >
                <CardItem 
                  translateZ="100"
                  rotateX={20}
                  rotateZ={-10}
                  className="w-full mt-4"
                  style={{ width: '100%', height: '150px', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}
                >
                  <Image 
                    src={`/occ/${occupation.toLowerCase()}.png`} 
                    alt={occupation} 
                    className="object-contain" // Keep image contained inside div
                    width={100} 
                    height={100} 
                    style={{ maxWidth: '100%', maxHeight: '100%', borderRadius: '8px' }} // Border radius for image
                  />
                </CardItem>
                <CardItem 
                  as="p"
                  translateZ="60" 
                  className="text-center border-t-2 border-black w-[50%] mt-4 text-lg font-semibold"
                >
                  {occupation}
                </CardItem>
              </CardBody>
            </CardContainer>
          ))}
        </div>

        <div className="mt-4">
          {error && <div className="text-red-500">{error}</div>}
          {success && <div className="text-green-500">{success}</div>}
        </div>

        <div className="mt-4 flex justify-between">
          <Button 
            onClick={handleSubmit} 
            disabled={!selectedCard || isPending} 
            variant="outline" 
            className="px-8 py-2 dark:shadow-white rounded-md border bg-white border-black dark:bg-white dark:text-black text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200 text-black"
          >
            Submit
          </Button>
          <Button 
            onClick={onNext} 
            variant="outline" 
            className="px-8 py-2 dark:shadow-white rounded-md border bg-white border-black dark:bg-white dark:text-black text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200 text-black"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Steone;
