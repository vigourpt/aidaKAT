import React from 'react';
import { X } from 'lucide-react';

interface InstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const InstructionsModal: React.FC<InstructionsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Instructions & FAQs</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close instructions"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          <section>
            <h3 className="text-xl font-semibold mb-4">Getting Started</h3>
            <ol className="list-decimal list-inside space-y-3">
              <li>Click the Settings icon (⚙️) in the top right</li>
              <li>Enter your API keys:
                <ul className="list-disc list-inside ml-6 mt-2 space-y-2">
                  <li>OpenAI API key (from <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">OpenAI Dashboard</a>)</li>
                  <li>Keywords Everywhere API key (from <a href="https://keywordseverywhere.com/api.html" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">Keywords Everywhere</a>)</li>
                </ul>
              </li>
              <li>Save your settings</li>
            </ol>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-4">Using the Tool</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Keyword Analysis</h4>
                <ol className="list-decimal list-inside space-y-2">
                  <li>Enter your main keyword in the Keyword Analysis section</li>
                  <li>Click Analyze to generate AIDA-framework keywords</li>
                  <li>View metrics for each keyword (Volume, CPC, Competition)</li>
                  <li>Export results to CSV for further analysis</li>
                </ol>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Content Bridge Generator</h4>
                <ol className="list-decimal list-inside space-y-2">
                  <li>Enter your starting topic/keyword</li>
                  <li>Enter your target topic/keyword</li>
                  <li>Click Generate Bridge to create a content transition plan</li>
                  <li>Use the suggested transitions in your content</li>
                </ol>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-4">Frequently Asked Questions</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold">What is the AIDA framework?</h4>
                <p className="text-gray-600 mt-1">AIDA stands for Awareness, Interest, Desire, and Action. It's a marketing model that describes the stages a customer goes through in the decision-making process.</p>
              </div>

              <div>
                <h4 className="font-semibold">Are my API keys secure?</h4>
                <p className="text-gray-600 mt-1">Yes, your API keys are stored locally in your browser and are never sent to our servers. They're only used to make direct API calls to OpenAI and Keywords Everywhere.</p>
              </div>

              <div>
                <h4 className="font-semibold">What do the keyword metrics mean?</h4>
                <ul className="list-disc list-inside space-y-2 text-gray-600 mt-1">
                  <li>Volume: Monthly search volume</li>
                  <li>CPC: Average cost per click in Google Ads</li>
                  <li>Competition: Competitive density (0-100%)</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold">How does the Content Bridge Generator work?</h4>
                <p className="text-gray-600 mt-1">It uses AI to analyze both topics and creates a logical path between them, suggesting how to naturally transition from one topic to another in your content. This helps create coherent content that smoothly connects different topics.</p>
              </div>

              <div>
                <h4 className="font-semibold">Why do I need both API keys?</h4>
                <p className="text-gray-600 mt-1">OpenAI generates keyword suggestions and content transitions, while Keywords Everywhere provides real search volume and competition data for the keywords.</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default InstructionsModal;