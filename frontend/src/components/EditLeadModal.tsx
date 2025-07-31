import React, { useState, useEffect } from 'react';
import { X, Save, User, Building, Phone, Mail, Award,  FileText } from 'lucide-react';
import API from '../api/axios';

interface LeadData {
  _id: string;
  type_of_lead: string;
  project_name: string;
  name_of_lead: string;
  designation_of_lead: string;
  company_name: string;
  phone_number_of_lead: string;
  email_of_lead: string;
  intrested: 'HOT' | 'COLD' | 'WARM' | 'NOT INTERESTED';
  follow_up_conversation: string;
  status: 'Open' | 'Close';
  created_by: string;
  created_at: string;
  updated_at: string;
}

interface EditLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: LeadData | null;
  onUpdate: (updatedLead: LeadData) => void;
}

const EditLeadModal: React.FC<EditLeadModalProps> = ({ isOpen, onClose, lead, onUpdate }) => {
  const [formData, setFormData] = useState<Partial<LeadData>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [customLeadTypes, setCustomLeadTypes] = useState<string[]>([]);

  useEffect(() => {
    if (lead) {
      setFormData({
        type_of_lead: lead.type_of_lead,
        project_name: lead.project_name,
        name_of_lead: lead.name_of_lead,
        designation_of_lead: lead.designation_of_lead,
        company_name: lead.company_name,
        phone_number_of_lead: lead.phone_number_of_lead,
        email_of_lead: lead.email_of_lead,
        intrested: lead.intrested,
        follow_up_conversation: lead.follow_up_conversation,
        status: lead.status
      });
      setErrors({});
    }
  }, [lead]);

  // Fetch custom lead types when modal opens
  useEffect(() => {
    if (isOpen) {
      const fetchCustomLeadTypes = async () => {
        try {
          const response = await API.get('/sales/custom-lead-types');
          if (response.data.success) {
            setCustomLeadTypes(response.data.data);
          }
        } catch (error) {
          console.error('Error fetching custom lead types:', error);
        }
      };

      fetchCustomLeadTypes();
    }
  }, [isOpen]);

  const handleInputChange = (field: keyof LeadData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.type_of_lead) newErrors.type_of_lead = 'Type of lead is required';
    if (!formData.project_name) newErrors.project_name = 'Project name is required';
    if (!formData.name_of_lead) newErrors.name_of_lead = 'Name is required';
    if (!formData.designation_of_lead) newErrors.designation_of_lead = 'Designation is required';
    if (!formData.company_name) newErrors.company_name = 'Company name is required';
    if (!formData.phone_number_of_lead) newErrors.phone_number_of_lead = 'Phone number is required';
    if (!formData.email_of_lead) newErrors.email_of_lead = 'Email is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !lead) return;

    setIsLoading(true);
    try {
      const response = await API.put(`/sales/leads/${lead._id}`, formData);
      
      if (response.data.success) {
        onUpdate(response.data.data);
        onClose();
      }
    } catch (error: any) {
      console.error('Error updating lead:', error);
      if (error.response?.data?.errors) {
        const apiErrors: Record<string, string> = {};
        error.response.data.errors.forEach((err: string) => {
          // Map API errors to form fields
          if (err.includes('type_of_lead')) apiErrors.type_of_lead = err;
          else if (err.includes('project_name')) apiErrors.project_name = err;
          else if (err.includes('name_of_lead')) apiErrors.name_of_lead = err;
          else if (err.includes('designation_of_lead')) apiErrors.designation_of_lead = err;
          else if (err.includes('company_name')) apiErrors.company_name = err;
          else if (err.includes('phone_number_of_lead')) apiErrors.phone_number_of_lead = err;
          else if (err.includes('email_of_lead')) apiErrors.email_of_lead = err;
        });
        setErrors(apiErrors);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !lead) return null;

  return (
    <div className="fixed inset-0 bg-[#000000B3] bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Edit Lead</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Type of Lead */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Award className="w-4 h-4 inline mr-2" />
                Type of Lead
              </label>
              <select
                value={formData.type_of_lead || ''}
                onChange={(e) => handleInputChange('type_of_lead', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.type_of_lead ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select Type</option>
                <option value="lead">Lead</option>
                <option value="speaker">Speaker</option>
                <option value="sponsor">Sponsor</option>
                <option value="awards">Awards</option>
                <option value="other">Other</option>
                {customLeadTypes.map((customType, index) => (
                  <option key={index} value={customType}>{customType}</option>
                ))}
              </select>
              {errors.type_of_lead && (
                <p className="text-red-500 text-sm mt-1">{errors.type_of_lead}</p>
              )}
            </div>

            {/* Project Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Name
              </label>
              <input
                type="text"
                value={formData.project_name || ''}
                onChange={(e) => handleInputChange('project_name', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.project_name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter project name"
              />
              {errors.project_name && (
                <p className="text-red-500 text-sm mt-1">{errors.project_name}</p>
              )}
            </div>

            {/* Name of Lead */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 inline mr-2" />
                Name of Lead
              </label>
              <input
                type="text"
                value={formData.name_of_lead || ''}
                onChange={(e) => handleInputChange('name_of_lead', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.name_of_lead ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter lead name"
              />
              {errors.name_of_lead && (
                <p className="text-red-500 text-sm mt-1">{errors.name_of_lead}</p>
              )}
            </div>

            {/* Designation */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Designation
              </label>
              <input
                type="text"
                value={formData.designation_of_lead || ''}
                onChange={(e) => handleInputChange('designation_of_lead', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.designation_of_lead ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter designation"
              />
              {errors.designation_of_lead && (
                <p className="text-red-500 text-sm mt-1">{errors.designation_of_lead}</p>
              )}
            </div>

            {/* Company Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Building className="w-4 h-4 inline mr-2" />
                Company Name
              </label>
              <input
                type="text"
                value={formData.company_name || ''}
                onChange={(e) => handleInputChange('company_name', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.company_name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter company name"
              />
              {errors.company_name && (
                <p className="text-red-500 text-sm mt-1">{errors.company_name}</p>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Phone className="w-4 h-4 inline mr-2" />
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phone_number_of_lead || ''}
                onChange={(e) => handleInputChange('phone_number_of_lead', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.phone_number_of_lead ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter phone number"
              />
              {errors.phone_number_of_lead && (
                <p className="text-red-500 text-sm mt-1">{errors.phone_number_of_lead}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="w-4 h-4 inline mr-2" />
                Email
              </label>
              <input
                type="email"
                value={formData.email_of_lead || ''}
                onChange={(e) => handleInputChange('email_of_lead', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.email_of_lead ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter email address"
              />
              {errors.email_of_lead && (
                <p className="text-red-500 text-sm mt-1">{errors.email_of_lead}</p>
              )}
            </div>

            {/* Interest Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Interest Level
              </label>
              <select
                value={formData.intrested || ''}
                onChange={(e) => handleInputChange('intrested', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="COLD">COLD</option>
                <option value="WARM">WARM</option>
                <option value="HOT">HOT</option>
                <option value="NOT INTERESTED">NOT INTERESTED</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={formData.status || ''}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Open">Open</option>
                <option value="Close">Close</option>
              </select>
            </div>
          </div>

          {/* Follow Up Conversation */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FileText className="w-4 h-4 inline mr-2" />
              Follow Up Conversation
            </label>
            <textarea
              value={formData.follow_up_conversation || ''}
              onChange={(e) => handleInputChange('follow_up_conversation', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter follow up conversation notes..."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              <Save size={16} />
              {isLoading ? 'Updating...' : 'Update Lead'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditLeadModal; 