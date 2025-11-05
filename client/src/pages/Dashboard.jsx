import { useQuery } from 'react-query'
import { Link } from 'react-router-dom'
import { baptismAPI, deathAPI, marriageAPI } from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'

const Dashboard = () => {
  const { data: baptisms, isLoading: loadingBaptisms } = useQuery(
    ['baptism:recent'],
    () => baptismAPI.getCertificates({ limit: 5 })
  )
  const { data: deaths, isLoading: loadingDeaths } = useQuery(
    ['death:recent'],
    () => deathAPI.getCertificates({ limit: 5 })
  )
  const { data: marriages, isLoading: loadingMarriages } = useQuery(
    ['marriage:recent'],
    () => marriageAPI.getCertificates({ limit: 5 })
  )

  if (loadingBaptisms || loadingDeaths || loadingMarriages) {
    return <LoadingSpinner size="xl" className="h-64" />
  }

  const section = (title, items = [], getDisplay, linkFor) => (
    <div className="card">
      <div className="card-header">
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      </div>
      <div className="card-body">
        {items.length > 0 ? (
          <ul className="-my-5 divide-y divide-gray-200">
            {items.map((item) => (
              <li key={item._id} className="py-4">
                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {getDisplay(item)}
                    </p>
                  </div>
                  <Link
                    to={linkFor(item)}
                    className="text-primary-600 hover:text-primary-900 text-sm font-medium"
                  >
                    View / Print
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-6 text-sm text-gray-500">No entries</div>
        )}
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">Issued certificates overview</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {section(
          'Recent Baptism Certificates',
          baptisms?.data?.data || [],
          (c) => `${c.name} — ${new Date(c.dateOfBaptism).toLocaleDateString()}`,
          (c) => `/baptism?id=${c._id}`
        )}
        {section(
          'Recent Death Certificates',
          deaths?.data?.data || [],
          (c) => `${c.nameOfDeceased} — ${new Date(c.dateOfDeath).toLocaleDateString()}`,
          (c) => `/death?id=${c._id}`
        )}
        {section(
          'Recent Marriage Certificates',
          marriages?.data?.data || [],
          (c) => `${c.bridegroomsName} & ${c.bridesName} — ${new Date(c.dateOfMarriage).toLocaleDateString()}`,
          (c) => `/marriage?id=${c._id}`
        )}
      </div>
    </div>
  )
}

export default Dashboard
