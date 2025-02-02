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

const Stepone: React.FC<StepTwoProps> = ({ onNext, step }) => {
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

    const adminRef = doc(db, "admins", session.user.id);

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
    <div className="flex flex-row w-full h-full">
      <div className="flex flex-col mt-5 min-h-[50rem] w-[10rem] md:w-[20rem] space-y-4">
        <Button 
          variant="outline" 
          className={step === 1 ? "px-4 py-0.5 ethereal-chill z-[2] dark:text-white border-2 border-black dark:border-white uppercase  text-black transition duration-200 text-sm shadow-[1px_1px_rgba(0,0,0),2px_2px_rgba(0,0,0),3px_3px_rgba(0,0,0),4px_4px_rgba(0,0,0),5px_5px_0px_0px_rgba(0,0,0)] dark:shadow-[1px_1px_rgba(255,255,255),2px_2px_rgba(255,255,255),3px_3px_rgba(255,255,255),4px_4px_rgba(255,255,255),5px_5px_0px_0px_rgba(255,255,255)]" : ""}>
          Select Occupation
        </Button>
      </div>

      <div className="flex-1 p-4  rounded-lg ml-4">
  <h3 className="text-xl md:text-2xl dark:text-white mb-4">Choose an Occupation</h3>

  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-7">
    {occupations.map((occupation) => (
      <CardContainer key={occupation}> {/* Add key prop here */}
        <CardBody
          className={`bg-black w-[100px] h-[100px] md:min-w-[130px] md:min-h-[130px] md:h-[200px]  md:w-[200px] group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] shadow-lg rounded-lg flex flex-col justify-center items-center cursor-pointer border border-gray-300`}
          style={{
            boxShadow:
              selectedCard === occupation || submittedCard === occupation
                ? "inset 0 0 40px 1px #00ff00, inset 0 -2px 0 0 transparent" // Green box-shadow for selected card
                : "inset 0 0 70px 2px #fa309586, inset 0 -2px 0 0 transparent", // Default box-shadow
          }}
          onClick={() => handleCardClick(occupation)}
        >
          <CardItem
            translateZ="100"
            rotateX={20}
            rotateZ={-10}
            className="w-full mt-4"
            style={{
              width: '100%',
              height: '150px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              overflow: 'hidden',
            }}
          >
            <Image
              src={`/occ/${occupation.toLowerCase()}.png`}
              alt={occupation}
              className="object-contain"
              width={100}
              height={100}
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                borderRadius: '8px',
              }}
            />
          </CardItem>
          <CardItem
            as="p"
            translateZ="60"
            className="text-center border-t-2 text-white border-white w-[70%] mb-4 text-sm md:text-base font-semibold"
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
      className="px-6 py-2 md:px-8 md:py-3 rounded-md border bg-white border-black dark:bg-white dark:text-black text-xs md:text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200 text-black"
    >
      Submit
    </Button>
    <Button
      onClick={onNext}
      variant="outline"
      className="px-6 py-2 md:px-8 md:py-3 rounded-md border bg-white border-black dark:bg-white dark:text-black text-xs md:text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200 text-black"
    >
      Next
    </Button>
  </div>
</div>

    </div>
  );
};

export default Stepone;
