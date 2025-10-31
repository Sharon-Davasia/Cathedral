import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from 'react-query'
import { certificateAPI } from '../services/api'
import Button from '../components/Button'
import Input from '../components/Input'
import { Plus, X, Upload } from 'lucide-react'
import toast from 'react-hot-toast'

const CreateTemplate = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [backgroundImage, setBackgroundImage] = useState(null)
  const [fields, setFields] = useState([])

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm()

  const createTemplateMutation = useMutation(certificateAPI.createTemplate, {
    onSuccess: () => {
      queryClient.invalidateQueries('templates')
      toast.success('Template created successfully')
      navigate('/templates')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create template')
    }
  })

  const uploadFileMutation = useMutation(certificateAPI.uploadFile, {
    onSuccess: (response) => {
      setBackgroundImage(response.data.data)
      toast.success('File uploaded successfully')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to upload file')
    }
  })

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
    if (!backgroundImage) {
      toast.error('Please upload a background image')
      return
    }

    if (fields.length === 0) {
      toast.error('Please add at least one field')
      return
    }

    createTemplateMutation.mutate({
      ...data,
      fields,
      backgroundImageURL: backgroundImage.url,
      backgroundImageName: backgroundImage.originalName
    })
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      uploadFileMutation.mutate(file)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Create Template</h1>
        <p className="mt-1 text-sm text-gray-500">
          Design a new certificate template
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
            {backgroundImage ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <img
                    src={backgroundImage.url}
                    alt="Background preview"
                    className="h-32 w-auto object-contain border border-gray-300 rounded"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {backgroundImage.originalName}
                    </p>
                    <p className="text-sm text-gray-500">
                      {(backgroundImage.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setBackgroundImage(null)}
                >
                  <X className="h-4 w-4 mr-2" />
                  Remove Image
                </Button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <div className="text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4">
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <span className="mt-2 block text-sm font-medium text-gray-900">
                        Upload background image
                      </span>
                      <span className="mt-1 block text-sm text-gray-500">
                        PNG, JPG, or PDF up to 10MB
                      </span>
                    </label>
                    <input
                      id="file-upload"
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleFileUpload}
                      className="sr-only"
                      disabled={uploadFileMutation.isLoading}
                    />
                  </div>
                </div>
              </div>
            )}
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
                disabled={!backgroundImage}
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
            loading={createTemplateMutation.isLoading}
            disabled={!backgroundImage || fields.length === 0}
          >
            Create Template
          </Button>
        </div>
      </form>
    </div>
  )
}

export default CreateTemplate
