// frontend/src/components/leads/ContactExport.jsx
import React, { useState } from 'react';

const ContactExport = ({ leads, onExport }) => {
  const [exportFormat, setExportFormat] = useState('csv');
  const [includeFields, setIncludeFields] = useState({
    name: true,
    website: true,
    email: true,
    phone: true,
    address: true,
    industry: true,
    size: true
  });

  const handleFieldToggle = (field) => {
    setIncludeFields(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const exportData = () => {
    if (leads.length === 0) return;

    const selectedFields = Object.keys(includeFields).filter(field => includeFields[field]);
    
    if (exportFormat === 'csv') {
      exportToCSV(selectedFields);
    } else if (exportFormat === 'json') {
      exportToJSON(selectedFields);
    }
  };

  const exportToCSV = (fields) => {
    const headers = fields.map(field => {
      switch (field) {
        case 'name': return 'Company Name';
        case 'website': return 'Website';
        case 'email': return 'Contact Email';
        case 'phone': return 'Contact Phone';
        case 'address': return 'Contact Address';
        case 'industry': return 'Industry';
        case 'size': return 'Company Size';
        default: return field;
      }
    });

    const csvContent = [
      headers.join(','),
      ...leads.map(lead => 
        fields.map(field => {
          let value = '';
          switch (field) {
            case 'name': value = lead.name || ''; break;
            case 'website': value = lead.website || ''; break;
            case 'email': value = lead.contact_email || ''; break;
            case 'phone': value = lead.contact_phone || ''; break;
            case 'address': value = lead.contact_address || ''; break;
            case 'industry': value = lead.industry || ''; break;
            case 'size': value = lead.size || ''; break;
            default: value = lead[field] || '';
          }
          // Escape commas and quotes in CSV
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            value = `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `leads_contact_info_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToJSON = (fields) => {
    const exportData = leads.map(lead => {
      const exportLead = {};
      fields.forEach(field => {
        switch (field) {
          case 'name': exportLead.companyName = lead.name; break;
          case 'website': exportLead.website = lead.website; break;
          case 'email': exportLead.contactEmail = lead.contact_email; break;
          case 'phone': exportLead.contactPhone = lead.contact_phone; break;
          case 'address': exportLead.contactAddress = lead.contact_address; break;
          case 'industry': exportLead.industry = lead.industry; break;
          case 'size': exportLead.companySize = lead.size; break;
          default: exportLead[field] = lead[field];
        }
      });
      return exportLead;
    });

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `leads_contact_info_${new Date().toISOString().split('T')[0]}.json`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const hasContactInfo = leads.some(lead => 
    lead.contact_email || lead.contact_phone || lead.contact_address
  );

  if (!hasContactInfo) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-900">Export Contact Information</h3>
        <span className="text-xs text-gray-500">
          {leads.filter(lead => lead.contact_email || lead.contact_phone || lead.contact_address).length} leads with contact info
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Export Format */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Export Format
          </label>
          <select
            value={exportFormat}
            onChange={(e) => setExportFormat(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="csv">CSV</option>
            <option value="json">JSON</option>
          </select>
        </div>

        {/* Include Fields */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Include Fields
          </label>
          <div className="space-y-2">
            {Object.entries(includeFields).map(([field, checked]) => (
              <label key={field} className="flex items-center">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => handleFieldToggle(field)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">
                  {field === 'name' ? 'Company Name' :
                   field === 'email' ? 'Contact Email' :
                   field === 'phone' ? 'Contact Phone' :
                   field === 'address' ? 'Contact Address' :
                   field === 'size' ? 'Company Size' :
                   field.charAt(0).toUpperCase() + field.slice(1)}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Export Button */}
        <div className="flex items-end">
          <button
            onClick={exportData}
            disabled={leads.length === 0}
            className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Export Contact Info
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContactExport;
