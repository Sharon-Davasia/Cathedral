import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { certificateAPI } from '../services/api'
import Button from '../components/Button'
import Input from '../components/Input'
import LoadingSpinner from '../components/LoadingSpinner'
import { Plus, X } from 'lucide-react'
import toast from 'react-hot-toast'

const GenerateCertificate = () => {
  const queryClient = useQueryClient()
  const [customFields, setCustomFields] = useState([])

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue
  } = useForm()

  const selectedTemplate = watch('templateId')

  const { data: templates } = useQuery(
    'templates',
    () => certificateAPI.getTemplates({ limit: 100 }),
    { select: (data) => data.data }
  )

  const generateCertificateMutation = useMutation(certificateAPI.generateCertificate, {
    onSuccess: () => {
      queryClient.invalidateQueries('certificates')
      toast.success('Certificate generated successfully')
      // Reset form
      setValue('recipientName', '')
      setValue('recipientEmail', '')
      setCustomFields([])
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to generate certificate')
    }
  })

  const addCustomField = () => {
    setCustomFields([...customFields, { name: '', value: '' }])
  }

  const removeCustomField = (index) => {
    setCustomFields(customFields.filter((_, i) => i !== index))
  }

  const updateCustomField = (index, field) => {
    const newFields = [...customFields]
    newFields[index] = { ...newFields[index], ...field }
    setCustomFields(newFields)
  }

  const onSubmit = (data) => {
    const customData = {}
    customFields.forEach(field => {
      if (field.name && field.value) {
        customData[field.name] = field.value
      }
    })

    generateCertificateMutation.mutate({
      ...data,
      customData
    })
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Generate Certificate</h1>
        <p className="mt-1 text-sm text-gray-500">
          Create a new certificate for a recipient
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">Certificate Details</h3>
          </div>
          <div className="card-body space-y-4">
            <div>
              <label className="form-label">Template</label>
              <select
                {...register('templateId', { required: 'Template is required' })}
                className="input"
              >
                <option value="">Select a template</option>
                {templates?.map((template) => (
                  <option key={template._id} value={template._id}>
                    {template.title}
                  </option>
                ))}
              </select>
              {errors.templateId && (
                <p className="text-sm text-red-600">{errors.templateId.message}</p>
              )}
            </div>

            <div>
              <label className="form-label">Recipient Name</label>
              <Input
                {...register('recipientName', { required: 'Recipient name is required' })}
                placeholder="Enter recipient name"
                error={errors.recipientName?.message}
              />
            </div>

            <div>
              <label className="form-label">Recipient Email</label>
              <Input
                type="email"
                {...register('recipientEmail', { 
                  required: 'Recipient email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
                placeholder="Enter recipient email"
                error={errors.recipientEmail?.message}
              />
            </div>
          </div>
        </div>

        {selectedTemplate && (
          <div className="card">
            <div className="card-header">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Custom Fields</h3>
                <Button
                  type="button"
                  variant="outline"
                  onClick={addCustomField}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Field
                </Button>
              </div>
            </div>
            <div className="card-body">
              {customFields.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-sm text-gray-500">
                    No custom fields added. Click "Add Field" to include additional data.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {customFields.map((field, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <div className="flex-1">
                        <Input
                          value={field.name}
                          onChange={(e) => updateCustomField(index, { name: e.target.value })}
                          placeholder="Field name"
                        />
                      </div>
                      <div className="flex-1">
                        <Input
                          value={field.value}
                          onChange={(e) => updateCustomField(index, { value: e.target.value })}
                          placeholder="Field value"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="small"
                        onClick={() => removeCustomField(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => window.history.back()}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={generateCertificateMutation.isLoading}
            disabled={!selectedTemplate}
          >
            Generate Certificate
          </Button>
        </div>
      </form>
    </div>
  )
}

export default GenerateCertificate
