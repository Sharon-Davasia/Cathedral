import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { certificateAPI } from '../services/api'
import Button from '../components/Button'
import Input from '../components/Input'
import LoadingSpinner from '../components/LoadingSpinner'
import { Plus, X } from 'lucide-react'
import toast from 'react-hot-toast'

const EditTemplate = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [fields, setFields] = useState([])

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm()

  const { data: template, isLoading } = useQuery(
    ['template', id],
    () => certificateAPI.getTemplate(id),
    {
      onSuccess: (data) => {
        const templateData = data.data
        setValue('title', templateData.title)
        setValue('description', templateData.description)
        setFields(templateData.fields || [])
      }
    }
  )

  const updateTemplateMutation = useMutation(
    (data) => certificateAPI.updateTemplate(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('templates')
        queryClient.invalidateQueries(['template', id])
        toast.success('Template updated successfully')
        navigate('/templates')
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to update template')
      }
    }
  )

  const addField = () => {
    setFields([...fields, {
      name: '',
      x: 0,
      y: 0,
      fontSize: 12,
      color: '#000000'
    }])
  }

  const removeField = (index) => {
    setFields(fields.filter((_, i) => i !== index))
  }

  const updateField = (index, field) => {
    const newFields = [...fields]
    newFields[index] = { ...newFields[index], ...field }
    setFields(newFields)
  }

  const onSubmit = (data) => {
    if (fields.length === 0) {
      toast.error('Please add at least one field')
      return
    }

    updateTemplateMutation.mutate({
      ...data,
      fields
    })
  }

  if (isLoading) {
    return <LoadingSpinner size="xl" className="h-64" />
  }

  if (!template) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">Template not found</h3>
        <p className="mt-1 text-sm text-gray-500">
          The template you're looking for doesn't exist.
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Edit Template</h1>
        <p className="mt-1 text-sm text-gray-500">
          Update your certificate template
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">Template Details</h3>
          </div>
          <div className="card-body space-y-4">
            <div>
              <label className="form-label">Template Title</label>
              <Input
                {...register('title', { required: 'Title is required' })}
                placeholder="Enter template title"
                error={errors.title?.message}
              />
            </div>
            
            <div>
              <label className="form-label">Description</label>
              <textarea
                {...register('description')}
                rows={3}
                className="input"
                placeholder="Enter template description"
              />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">Background Image</h3>
          </div>
          <div className="card-body">
            <div className="flex items-center space-x-4">
              <img
                src={template.data.backgroundImageURL}
                alt="Background preview"
                className="h-32 w-auto object-contain border border-gray-300 rounded"
              />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {template.data.backgroundImageName}
                </p>
                <p className="text-sm text-gray-500">
                  Current background image
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Template Fields</h3>
              <Button
                type="button"
                variant="outline"
                onClick={addField}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Field
              </Button>
            </div>
          </div>
          <div className="card-body">
            {fields.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-sm text-gray-500">
                  No fields added yet. Click "Add Field" to get started.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {fields.map((field, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-sm font-medium text-gray-900">
                        Field {index + 1}
                      </h4>
                      <Button
                        type="button"
                        variant="ghost"
                        size="small"
                        onClick={() => removeField(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      <div>
                        <label className="form-label">Field Name</label>
                        <Input
                          value={field.name}
                          onChange={(e) => updateField(index, { name: e.target.value })}
                          placeholder="e.g., recipient_name"
                        />
                      </div>
                      
                      <div>
                        <label className="form-label">X Position</label>
                        <Input
                          type="number"
                          value={field.x}
                          onChange={(e) => updateField(index, { x: parseInt(e.target.value) || 0 })}
                        />
                      </div>
                      
                      <div>
                        <label className="form-label">Y Position</label>
                        <Input
                          type="number"
                          value={field.y}
                          onChange={(e) => updateField(index, { y: parseInt(e.target.value) || 0 })}
                        />
                      </div>
                      
                      <div>
                        <label className="form-label">Font Size</label>
                        <Input
                          type="number"
                          value={field.fontSize}
                          onChange={(e) => updateField(index, { fontSize: parseInt(e.target.value) || 12 })}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/templates')}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={updateTemplateMutation.isLoading}
            disabled={fields.length === 0}
          >
            Update Template
          </Button>
        </div>
      </form>
    </div>
  )
}

export default EditTemplate
