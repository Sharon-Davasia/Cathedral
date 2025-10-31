import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from 'react-query'
import { certificateAPI } from '../services/api'
import Button from '../components/Button'
import LoadingSpinner from '../components/LoadingSpinner'
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react'

const Templates = () => {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const { data, isLoading } = useQuery(
    ['templates', { search, page }],
    () => certificateAPI.getTemplates({ search, page, limit: 10 }),
    { keepPreviousData: true }
  )

  const handleSearch = (e) => {
    setSearch(e.target.value)
    setPage(1)
  }

  if (isLoading) {
    return <LoadingSpinner size="xl" className="h-64" />
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Certificate Templates</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your certificate templates
          </p>
        </div>
        <Link to="/templates/create">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Template
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search templates..."
            value={search}
            onChange={handleSearch}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
      </div>

      {/* Templates Grid */}
      {data?.data?.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data.data.map((template) => (
            <div key={template._id} className="card">
              <div className="card-body">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">
                    {template.title}
                  </h3>
                  <div className="flex space-x-2">
                    <Link
                      to={`/templates/${template._id}/edit`}
                      className="text-primary-600 hover:text-primary-900"
                    >
                      <Edit className="h-4 w-4" />
                    </Link>
                    <button className="text-red-600 hover:text-red-900">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                {template.description && (
                  <p className="mt-2 text-sm text-gray-500">
                    {template.description}
                  </p>
                )}
                
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-500">
                    <span>{template.fields?.length || 0} fields</span>
                    <span className="mx-2">•</span>
                    <span>{template.usageCount || 0} uses</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    Created by {template.createdBy?.name}
                  </div>
                </div>
                
                <div className="mt-4 flex space-x-2">
                  <Button variant="outline" size="small" className="flex-1">
                    <Eye className="h-4 w-4 mr-1" />
                    Preview
                  </Button>
                  <Link
                    to={`/certificates/generate?template=${template._id}`}
                    className="flex-1"
                  >
                    <Button size="small" className="w-full">
                      Use Template
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No templates</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating a new template.
          </p>
          <div className="mt-6">
            <Link to="/templates/create">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Template
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Pagination */}
      {data?.pagination && data.pagination.pages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {((data.pagination.current - 1) * 10) + 1} to{' '}
            {Math.min(data.pagination.current * 10, data.pagination.total)} of{' '}
            {data.pagination.total} results
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="small"
              disabled={data.pagination.current === 1}
              onClick={() => setPage(data.pagination.current - 1)}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="small"
              disabled={data.pagination.current === data.pagination.pages}
              onClick={() => setPage(data.pagination.current + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Templates
