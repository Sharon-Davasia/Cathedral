import { useState } from 'react'
import { useQuery } from 'react-query'
import { certificateAPI } from '../services/api'
import Button from '../components/Button'
import LoadingSpinner from '../components/LoadingSpinner'
import { Search, Download, Eye, Calendar } from 'lucide-react'

const Certificates = () => {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const { data, isLoading } = useQuery(
    ['certificates', { search, page }],
    () => certificateAPI.getIssuedCertificates({ search, page, limit: 10 }),
    { keepPreviousData: true }
  )

  const handleSearch = (e) => {
    setSearch(e.target.value)
    setPage(1)
  }

  const handleDownload = async (certificateId) => {
    try {
      const response = await certificateAPI.downloadCertificate(certificateId)
      const blob = new Blob([response.data])
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `certificate-${certificateId}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Download failed:', error)
    }
  }

  if (isLoading) {
    return <LoadingSpinner size="xl" className="h-64" />
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Issued Certificates</h1>
          <p className="mt-1 text-sm text-gray-500">
            View and manage all issued certificates
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search certificates..."
            value={search}
            onChange={handleSearch}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
      </div>

      {/* Certificates Table */}
      {data?.data?.length > 0 ? (
        <div className="card">
          <div className="overflow-x-auto">
            <table className="table">
              <thead className="table-header">
                <tr>
                  <th className="table-header-cell">Recipient</th>
                  <th className="table-header-cell">Email</th>
                  <th className="table-header-cell">Template</th>
                  <th className="table-header-cell">Serial Number</th>
                  <th className="table-header-cell">Issue Date</th>
                  <th className="table-header-cell">Status</th>
                  <th className="table-header-cell">Actions</th>
                </tr>
              </thead>
              <tbody className="table-body">
                {data.data.map((certificate) => (
                  <tr key={certificate._id} className="table-row">
                    <td className="table-cell">
                      <div className="font-medium text-gray-900">
                        {certificate.recipientName}
                      </div>
                    </td>
                    <td className="table-cell text-gray-500">
                      {certificate.recipientEmail}
                    </td>
                    <td className="table-cell">
                      <div className="text-sm text-gray-900">
                        {certificate.templateId?.title}
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="text-sm font-mono text-gray-500">
                        {certificate.serialNumber}
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(certificate.issueDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="table-cell">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        certificate.status === 'issued' 
                          ? 'bg-yellow-100 text-yellow-800'
                          : certificate.status === 'downloaded'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {certificate.status}
                      </span>
                    </td>
                    <td className="table-cell">
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="small"
                          onClick={() => handleDownload(certificate._id)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="small"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <Download className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No certificates</h3>
          <p className="mt-1 text-sm text-gray-500">
            No certificates have been issued yet.
          </p>
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

export default Certificates
