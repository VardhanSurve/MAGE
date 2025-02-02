// pages/index.js
'use client'; 
import { db } from "@/app/firebase/config";
import { AppSidebar } from '@/components/sidee/sidebarr';
import { Input } from '@/components/ui/input';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { useCardStore } from '@/lib/zusatnd';
import { doc, updateDoc, arrayUnion, getDoc, onSnapshot, arrayRemove } from 'firebase/firestore';
import { useEffect, useRef, useState } from 'react';
import { useSession } from "next-auth/react";
import { IoMdClose } from 'react-icons/io'; // Import cross icon
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { RetailItems, SponerItems } from "@/lib/sidebaritem";
import BackdropGradient from "@/components/bggradiant";

export default function Home({ params }: { params: { name: string } }) {
  const card = useCardStore((state) => state.card);
  const [, setLoading] = useState(false); // State to track if saving is in progress
  const { data: session } = useSession();
  const [cardData, setCardData] = useState<any>([]);
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  const addCard = useCardStore((state) => state.addCard);
  const removeCard = useCardStore((state) => state.removeCard); // Access the removeCard action
  const clearCard = useCardStore((state) => state.clearCard); // Action to clear cards in Zustand

  const handleInputChange = (cardId: string, fieldId: string, value: string) => {
    const uniqueFieldId = `${cardId}-${fieldId}`; // Create a unique ID for each field
    setFieldValues((prev) => ({ ...prev, [uniqueFieldId]: value }));
  };

  const handleRemoveCard = async (id: string) => {
    if (!session?.user?.id) return;
  
    try {
      const adminDocRef = doc(db, "retailers", session.user.id);
      const adminDocSnap = await getDoc(adminDocRef);
  
      console.log("Card ID to remove:", id);
  
      if (adminDocSnap.exists()) {
        const adminData = adminDocSnap.data();
        const selectedNameData = adminData?.adminCreate?.[params.name];
  console.log("naem,dat",selectedNameData)
        if (!selectedNameData) {
          toast.error('Selected name data not found');
          return;
        }
  
        // Check if the card exists in the selected array
        const cardToRemove = selectedNameData.find((card: any) => card.id === id);
        console.log("ncardddt",cardToRemove)

        if (cardToRemove) {
          // Use arrayRemove to efficiently remove the card from the Firestore array
          await updateDoc(adminDocRef, {
            [`adminCreate.${params.name}`]: arrayRemove(cardToRemove), // Remove the entire card object
          });
  
          toast.success("Card removed successfully!");
        } else {
          toast.error('Card not found in adminCreate.');
        }
      } else {
        toast.error('Admin document not found');
      }
    } catch (error) {
      console.error("Error removing card:", error);
      toast.error("Failed to remove card.");
    }
  };
  
  useEffect(() => {
    if (!session?.user?.id || !params?.name) return;
  
    const unsub = onSnapshot(
      doc(db, "retailers", session.user.id),
      (adminDocSnap) => {
        if (adminDocSnap.exists()) {
          const adminData = adminDocSnap.data();
          const selectedNameData = adminData?.adminCreate?.[params.name];
  
          if (selectedNameData) {
            console.log("Fetched real-time data for", params.name, selectedNameData);
            setCardData(selectedNameData); // Set real-time data to state
          } else {
            console.log(`No data found for ${params.name}`);
          }
        }
      },
      (error) => {
        console.error("Error with real-time listener:", error);
      }
    );
  
    // Clean up the listener on component unmount
    return () => unsub();
  }, [session?.user?.id, params?.name]);
  
  
  const getFieldValue = (cardName: string, fieldName: string) => {
    const card = cardData.find((data: any) => data.cardName === cardName);
    if (card) {
      const field = card.fieldsValue?.find((field: any) => field.fieldName === fieldName);
      return field ? field.value : ''; // Ensure defaulting to empty if value is undefined
    }
    return ''; // Default to empty string if card not found
  };

  const handleSave = async () => {
    setLoading(true);
    if (!session?.user?.id) return;
  
    try {
      // Ref to the specific admin document in Firestore
      const adminDocRef = doc(db, "retailers", session.user.id); 
      const allCards = useCardStore.getState().card;

      // Step 1: Create fieldsToSave with title, name, and fields values
      const fieldsToSave = allCards.map((singleCard, cardIdx) => ({
        id:singleCard.id,
        cardTitle: singleCard.title,  
        cardName: singleCard.name,    
        fieldsValue: singleCard.requiredFields.map((field, fieldIdx) => ({
          fieldName: field.fieldName,
          fieldType: field.fieldType,
          isDropdown: field.isDropdown || false,
          options: field.options || [""],
          min: field.min || "",
          max: field.max || "",
          step: field.step || "",
          value: fieldValues[`${singleCard.id}-${field.fieldName}`] || "", // Use the unique key
          fieldId: `card-${fieldIdx}`, // Unique field ID
        })),
      }));
  console.log("field",fieldsToSave)
      // Step 2: Update values after form submission
      const updatedFieldsValue = fieldsToSave.map((cardObj) => {
        cardObj?.fieldsValue?.forEach((field) => {
          const inputField = document.querySelector(`#${field.fieldId}`) as HTMLInputElement;
          if (inputField) {
            field.value = inputField.value.trim(); // Save user input
          }
        });
        return cardObj;
      });
  
      console.log("Updated Fields to Save:", updatedFieldsValue);
  
      // Step 3: Save to Firestore
      await updateDoc(adminDocRef, {
        [`adminCreate.${params.name}`]: arrayUnion(...updatedFieldsValue),
      });
  
      toast.success("Saved successfully!");
      clearCard(); // Reset the Zustand store, clearing the cards
    } catch (error) {
      console.error("Error saving to Firestore:", error);
      toast.error("Error saving data.");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (!session?.user?.id || !params?.name) return;
  
    const adminDocRef = doc(db, "retailers", session.user.id);
  
    const unsubscribe = onSnapshot(adminDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const adminData = docSnap.data();
        const selectedNameData = adminData?.adminCreate?.[params.name];
  
        if (selectedNameData) {
          setCardData(selectedNameData);  // Update state with new data from Firestore
        } else {
          setCardData([]);  // If no data, set it to empty
        }
      }
    });
  
    // Clean up the listener when the component unmounts or session changes
    return () => unsubscribe();
  }, [session?.user?.id, params?.name]);
  
  const addedRetail = useRef(false);
  const addedSponsor = useRef(false);
  
  useEffect(() => {
    if (cardData.length === 0 || card.length === 0) {
      if (params.name === "retailer" && !card.some(item => item.special === "ret") && !addedRetail.current) {
        RetailItems.forEach((item) => {
          addCard({
            id: item.id,
            special: "ret",
            title: item.title || "nott",
            name: item.name,
            requiredFields: item.requiredFields,
          });
        });
        addedRetail.current = true;  // Mark as added
      } else if (params.name === "sponsor" && !card.some(item => item.special === "spon") && !addedSponsor.current) {
        SponerItems.forEach((item) => {
          addCard({
            id: item.id,
            special: "spon",
            title: item.title || "nott",
            name: item.name,
            requiredFields: item.requiredFields,
          });
        });
        addedSponsor.current = true;  // Mark as added
      }
    }
  }, [params.name, cardData, card, addCard]);
  
  
    
  return (
    <div className="min-h-screen h-max w-screen dark-shadow  ">
      <SidebarProvider>
        <AppSidebar />
        <main>
          <SidebarTrigger className="fixed"/>
          <main className="flex-1 bg-black/30 w-[96vw] rounded-br-3xl rounded-bl-3xl border-white border-b-2 p-10">
            <div className="grid  lg:grid-cols-5 md:grid-cols-3 gap-4">
            {card.map((card) => (
                <div key={card.id} className="border p-4 text-white sched3  relative rounded-lg shadow-lg">
                   <button
  onClick={() => {
    if (card.id) {
      removeCard(card.id);
    } else {
      console.warn("No ID found for card:", card);
    }
  }}
  className="absolute top-2 right-2 text-red-600 hover:text-red-800"
  aria-label="Remove Card"
>
  <IoMdClose size={20} />
</button>

<p className="text-3xl font-bold">{card.title}</p>
<h3 className="text-base mt-2 text-gray-400 font-bold">{card.name}</h3>
{/* Render fields based on fetched data */}
                  <ul className="mt-2">
                  {card.requiredFields.map((field, fieldIdx) => (
                      <li key={fieldIdx} className="mb-2">
                        <span className="font-medium">{field.fieldName}:</span>
                        {field.fieldType === 'dropdown' ? (
                          <select
                          id={`card-field-${fieldIdx}`}
                          name={field.fieldName}
                            className="ml-2 p-1 border rounded-md"
                            onChange={(e) =>
                              handleInputChange(card.id, field.fieldName, e.target.value)
                            }
                            value={fieldValues[`${card.id}-${field.fieldName}`] || ""}
                          >
                            {field.options?.map((option, optionIndex) => (
                              <option key={optionIndex} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        ) : field.fieldType === 'range' ? (
                          <Input
                          id={`card-field-${fieldIdx}`}
                          name={field.fieldName}
                            type="number"
                            min={field.min}
                            max={field.max}
                            step={field.step}
                            className="ml-2 p-1 border rounded-md"
                            onChange={(e) =>
                              handleInputChange(card.id, field.fieldName, e.target.value)
                            }
                            value={fieldValues[`${card.id}-${field.fieldName}`] || ""}
                          />
                        ) : (
                          <Input
                          id={`card-field-${fieldIdx}`}
                          name={field.fieldName}
                            type="text"
                            placeholder={field.fieldName}
                            className="ml-2 p-1 border rounded-md"
                            value={fieldValues[`${card.id}-${field.fieldName}`] || ""}
                      onChange={(e) =>
                        handleInputChange(card.id, field.fieldName, e.target.value)
                      }
                    />
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            {card.length !== 0 &&
            <Button
            onClick={handleSave}
            variant="default"
            className="mt-4 p-2 px-6 rounded"
          >
            Save
          </Button>}
            
          
          </main>



          <div className="grid w-[95vw] grid-cols-3 lg:grid-cols-4 p-10 gap-4">
          {Array.isArray(cardData) && cardData.length > 0 ? (
    cardData.map((card, cardIndex) => (
      <BackdropGradient
          className="w-6/12 h-3/6 opacity-50"
        >
      <div key={cardIndex} className="border min-h-[200px] p-4 bg-grid-small-white/[0.3] border-white/40 bg-black text-white  rounded-lg shadow-lg">
        {/* Display Title and Name */}
                    <div className="flex justify-between">
              <div>
              <h3 className="text-2xl mb-2 font-bold">{card.cardTitle}</h3>
              <h3 className="text-base font-medium">{card.cardName}</h3>
              </div>
              {/* Cross Icon to Remove the Card */}
              <IoMdClose
                onClick={() => handleRemoveCard(card.id)} // Calls remove function on click
                className="text-xl cursor-pointer text-red-500"
              />
            </div>

        {/* Render Fields */}
        <ul className="mt-2 z-10">
          {card.fieldsValue.map((field, fieldIdx) => (
            <li key={fieldIdx} className="mb-2">
              <div className="flex flex-col px-6 py-1 items-start">
                {/* Display the field label */}
                <span className="font-medium mb-2 w-1/3">{field.fieldName}:</span>

                {/* Conditional rendering of input field type */}
                {field.fieldType === 'dropdown' ? (
                  <select
                    id={`card-${cardIndex}-field-${fieldIdx}`}
                    name={field.fieldName}
                    className="ml-2 p-1 border bg-black pointer-events-none rounded-md w-full"
                    defaultValue={field.value}
                  >
                    {field.options?.map((option, optionIndex) => (
                      <option key={optionIndex} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : field.fieldType === 'range' ? (
                  <Input
                    id={`card-${cardIndex}-field-${fieldIdx}`}
                    name={field.fieldName}
                    type="number"
                    min={field.min}
                    max={field.max}
                    step={field.step}
                    className="ml-2 p-1 border bg-black pointer-events-none rounded-md w-full"
                    defaultValue={
                      field.value.length > 5
                        ? `${field.value.slice(0, 3)}${"*".repeat(field.value.length - 5)}${field.value.slice(-2)}`
                        : field.value // Show full value if it's too short
                    }                  />
                ) : (
                  <Input
                    id={`card-${cardIndex}-field-${fieldIdx}`}
                    name={field.fieldName}
                    type="text"
                    placeholder={field.fieldName}
                    className="ml-2 p-1 border bg-black pointer-events-none rounded-md w-full"
                    defaultValue={
                      field.fieldName === "AWS BUCKET NAME"
                        ? field.value // Show full value for AWS BUCKET NAME
                        : field.value.length > 5
                        ? `${field.value.slice(0, 3)}${"*".repeat(field.value.length - 5)}${field.value.slice(-2)}`
                        : field.value // Show full value if too short
                    }                        />
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
      </BackdropGradient>
    ))
  ) : (
    <p>No cards available.</p>
  )}
  </div>
        </main>
      </SidebarProvider>
    
    </div>
  );
  
}
