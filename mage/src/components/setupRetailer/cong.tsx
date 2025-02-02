import React from 'react';
import { Button } from '@/components/ui/button';

interface FinalStepProps {
  onReset: () => void;
  email: string;
  name: string;
  profileImage: string;
  vectorModels: any[];
  embeddingModels: any[];
  dataLoaderModels: any[];
}

const FinalSteps: React.FC<FinalStepProps> = ({ onReset, email, name, profileImage, vectorModels, embeddingModels, dataLoaderModels }) => {
    console.log({ email, name, profileImage, vectorModels, embeddingModels, dataLoaderModels });

  return (
    <div className="p-8 w-[80rem] h-[70rem] bg-white dark:text-white rounded-lg shadow-md">
      <h2 className="text-3xl dark:text-black mb-4">Congratulations! Setup Completed</h2>
      <div className="space-y-6 overflow-y-scroll ">

        <div>
          <h3 className="text-xl dark:text-black font-bold">Vector Models</h3>
          {vectorModels.length > 0 ? (
            vectorModels.map((model, index) => (
              <div key={index} className="mt-2 p-4 rounded-xl dark:bg-muted  border ">
                <p><strong>Model:</strong> {model.model}</p>
                <p><strong>API Key:</strong> {model.apiKey}</p>
                <p><strong>Endpoint URL:</strong> {model.endpointUrl}</p>
                <p><strong>Region:</strong> {model.region}</p>
                <p><strong>Model Version:</strong> {model.modelVersion}</p>
                <p><strong>Storage:</strong> {model.storage}</p>
              </div>
            ))
          ) : (
            <p>No vector models configured.</p>
          )}
        </div>

        <div>
          <h3 className="text-xl dark:text-black font-bold">Embedding Models</h3>
          {embeddingModels.length > 0 ? (
            embeddingModels.map((model, index) => (
              <div key={index} className="mt-2 p-4 border rounded-xl dark:bg-muted ">
                <p><strong>Model:</strong> {model.model}</p>
                <p><strong>API Key:</strong> {model.apiKey}</p>
                <p><strong>Endpoint URL:</strong> {model.endpointUrl}</p>
                <p><strong>Region:</strong> {model.region}</p>
                <p><strong>Model Version:</strong> {model.modelVersion}</p>
                <p><strong>Storage:</strong> {model.storage}</p>
              </div>
            ))
          ) : (
            <p>No embedding models configured.</p>
          )}
        </div>

        <div>
          <h3 className="text-xl dark:text-black font-bold">Data Loader Models</h3>
          {dataLoaderModels.length > 0 ? (
            dataLoaderModels.map((model, index) => (
              <div key={index} className="mt-2 p-4 border rounded-xl dark:bg-muted ">
                <p><strong>Model:</strong> {model.model}</p>
                <p><strong>API Key:</strong> {model.apiKey}</p>
                <p><strong>Endpoint URL:</strong> {model.endpointUrl}</p>
                <p><strong>Region:</strong> {model.region}</p>
                <p><strong>Model Version:</strong> {model.modelVersion}</p>
                <p><strong>Storage:</strong> {model.storage}</p>
              </div>
            ))
          ) : (
            <p>No data loader models configured.</p>
          )}
        </div>
      </div>

      <div className="mt-6">
        <Button onClick={onReset} variant="default" className=' px-8 py-2 hover:bg-red-400 rounded-md border bg-red-400 border-black dark:bg-red-400 dark:text-black text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200 text-black'>Reset Setup</Button>
      </div>
    </div>
  );
};

export default FinalSteps;
