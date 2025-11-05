import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import Input from '../components/Input'
import Button from '../components/Button'
import Select from '../components/Select'
import { deathAPI } from '../services/api'

const DeathCertificate = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [isEditing, setIsEditing] = useState(false)
  const [certificateId, setCertificateId] = useState(null)
  const [searchName, setSearchName] = useState('')
  const [searchSerial, setSearchSerial] = useState('')
  const [printMode, setPrintMode] = useState(false)
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch
  } = useForm()

  useEffect(() => {
    const id = searchParams.get('id')
    if (id) {
      loadCertificate(id)
    }
  }, [searchParams])

  const loadCertificate = async (id) => {
    try {
      const response = await deathAPI.getCertificate(id)
      const data = response.data.data
      setIsEditing(true)
      setCertificateId(id)
      
      Object.keys(data).forEach(key => {
        if (key !== '_id' && key !== '__v' && key !== 'createdAt' && key !== 'updatedAt' && key !== 'createdBy' && key !== 'updatedBy') {
          if (key === 'dateOfDeath') {
            setValue(key, new Date(data[key]).toISOString().split('T')[0])
          } else {
            setValue(key, data[key])
          }
        }
      })
    } catch (error) {
      toast.error('Failed to load certificate')
    }
  }

  const onSubmit = async (data) => {
    try {
      if (isEditing) {
        await deathAPI.updateCertificate(certificateId, data)
        toast.success('Certificate updated successfully / प्रमाण पत्र सफलतापूर्वक अद्यतन किया गया')
      } else {
        await deathAPI.createCertificate(data)
        toast.success('Certificate saved successfully / प्रमाण पत्र सफलतापूर्वक सहेजा गया')
        reset()
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to save certificate'
      toast.error(`${message} / प्रमाण पत्र सहेजने में विफल`)
    }
  }

  const handleReset = () => {
    reset()
    setIsEditing(false)
    setCertificateId(null)
    setSearchParams({})
    toast.success('Form reset / फॉर्म रीसेट')
  }

  const handleSearch = async () => {
    try {
      const params = {}
      if (searchName) params.search = searchName
      if (searchSerial) params.search = searchSerial
      
      const response = await deathAPI.getCertificates({ ...params, limit: 1 })
      
      if (response.data.data.length > 0) {
        const cert = response.data.data[0]
        loadCertificate(cert._id)
        toast.success('Certificate found / प्रमाण पत्र मिला')
      } else {
        toast.error('No certificate found / कोई प्रमाण पत्र नहीं मिला')
      }
    } catch (error) {
      toast.error('Search failed / खोज विफल')
    }
  }

  const handlePrint = () => {
    setPrintMode(true)
    setTimeout(() => {
      window.print()
      setPrintMode(false)
    }, 100)
  }

  if (printMode) {
    return (
      <div className="print-container p-8 bg-white">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">DEATH CERTIFICATE / मृत्यु प्रमाण पत्र</h1>
          <h2 className="text-xl mb-1">ST. JOSEPH'S CATHEDRAL / सेंट जोसेफ कैथेड्रल</h2>
          <h3 className="text-lg">DIOCESE OF MEERUT / मेरठ धर्मप्रांत</h3>
        </div>
        <div className="space-y-4 text-sm">
          <p><strong>Serial No. / क्रमांक:</strong> {watch('serialNo') || ''}</p>
          <p><strong>Year / वर्ष:</strong> {watch('year') || ''}</p>
          <p><strong>Date of Death / मृत्यु की तिथि:</strong> {watch('dateOfDeath') || ''}</p>
          <p><strong>Name of Deceased / मृतक का नाम:</strong> {watch('nameOfDeceased') || ''}</p>
          <p><strong>Sex / लिंग:</strong> {watch('sex') || ''}</p>
          <p><strong>Father's Name / पिता का नाम:</strong> {watch('fathersName') || ''}</p>
          <p><strong>Mother's Name / माता का नाम:</strong> {watch('mothersName') || ''}</p>
          <p><strong>Spouse's Name / पति/पत्नी का नाम:</strong> {watch('spousesName') || ''}</p>
          <p><strong>Address / पता:</strong> {watch('address') || ''}</p>
          <p><strong>Cause of Death / मृत्यु का कारण:</strong> {watch('causeOfDeath') || ''}</p>
          <p><strong>Age at Death / मृत्यु के समय आयु:</strong> {watch('ageAtDeath') || ''}</p>
          <p><strong>Minister's Name / मंत्री का नाम:</strong> {watch('ministersName') || ''}</p>
        </div>
        <div className="mt-12 flex justify-between">
          <div>
            <p><strong>Parochial Seal / पेरोकियल सील</strong></p>
          </div>
          <div className="text-right">
            <p><strong>Date / दिनांक:</strong> {new Date().toLocaleDateString()}</p>
            <p><strong>Father-in-charge / प्रभारी फादर</strong></p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold mb-2 text-gray-900">DEATH CERTIFICATE / मृत्यु प्रमाण पत्र</h1>
            <h2 className="text-xl mb-1 text-gray-700">ST. JOSEPH'S CATHEDRAL / सेंट जोसेफ कैथेड्रल</h2>
            <h3 className="text-lg text-gray-600">DIOCESE OF MEERUT / मेरठ धर्मप्रांत</h3>
          </div>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Search Death Certificate / मृत्यु प्रमाण पत्र खोजें</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="searchName" className="block text-sm font-medium text-gray-700 mb-2">
                Search by Name / नाम से खोजें:
              </label>
              <Input
                id="searchName"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                placeholder="Enter name / नाम दर्ज करें"
              />
            </div>
            <div>
              <label htmlFor="searchSerial" className="block text-sm font-medium text-gray-700 mb-2">
                Or by Serial No. / या क्रमांक:
              </label>
              <Input
                id="searchSerial"
                value={searchSerial}
                onChange={(e) => setSearchSerial(e.target.value)}
                placeholder="Enter serial number / क्रमांक दर्ज करें"
              />
            </div>
          </div>
          <Button
            type="button"
            onClick={handleSearch}
            className="mt-4"
            variant="primary"
          >
            Search / खोजें
          </Button>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Serial No */}
            <div>
              <label htmlFor="serialNo" className="block text-sm font-medium text-gray-700 mb-2">
                Serial No. / क्रमांक: <span className="text-red-500">*</span>
              </label>
              <Input
                id="serialNo"
                {...register('serialNo', { required: 'Serial number is required / क्रमांक आवश्यक है' })}
                error={errors.serialNo?.message}
                placeholder="Enter serial number / क्रमांक दर्ज करें"
                className={errors.serialNo ? 'border-red-500' : ''}
              />
            </div>

            {/* Year */}
            <div>
              <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-2">
                Year / वर्ष: <span className="text-red-500">*</span>
              </label>
              <Input
                id="year"
                {...register('year', { required: 'Year is required / वर्ष आवश्यक है' })}
                error={errors.year?.message}
                placeholder="Enter year / वर्ष दर्ज करें"
                className={errors.year ? 'border-red-500' : ''}
              />
            </div>

            {/* Date of Death */}
            <div>
              <label htmlFor="dateOfDeath" className="block text-sm font-medium text-gray-700 mb-2">
                Date of Death / मृत्यु की तिथि: <span className="text-red-500">*</span>
              </label>
              <Input
                id="dateOfDeath"
                type="date"
                {...register('dateOfDeath', { required: 'Date of death is required / मृत्यु की तिथि आवश्यक है' })}
                error={errors.dateOfDeath?.message}
                className={errors.dateOfDeath ? 'border-red-500' : ''}
              />
            </div>

            {/* Name of Deceased */}
            <div>
              <label htmlFor="nameOfDeceased" className="block text-sm font-medium text-gray-700 mb-2">
                Name of Deceased / मृतक का नाम: <span className="text-red-500">*</span>
              </label>
              <Input
                id="nameOfDeceased"
                {...register('nameOfDeceased', { required: 'Name of deceased is required / मृतक का नाम आवश्यक है' })}
                error={errors.nameOfDeceased?.message}
                placeholder="Enter name / नाम दर्ज करें"
                className={errors.nameOfDeceased ? 'border-red-500' : ''}
              />
            </div>

            {/* Sex */}
            <div>
              <label htmlFor="sex" className="block text-sm font-medium text-gray-700 mb-2">
                Sex / लिंग: <span className="text-red-500">*</span>
              </label>
              <Select
                id="sex"
                {...register('sex', { required: 'Sex is required / लिंग आवश्यक है' })}
                error={errors.sex?.message}
                className={errors.sex ? 'border-red-500' : ''}
              >
                <option value="">Select / चुनें</option>
                <option value="Male">Male / पुरुष</option>
                <option value="Female">Female / महिला</option>
              </Select>
            </div>

            {/* Father's Name */}
            <div>
              <label htmlFor="fathersName" className="block text-sm font-medium text-gray-700 mb-2">
                Father's Name / पिता का नाम: <span className="text-red-500">*</span>
              </label>
              <Input
                id="fathersName"
                {...register('fathersName', { required: "Father's name is required / पिता का नाम आवश्यक है" })}
                error={errors.fathersName?.message}
                placeholder="Enter father's name / पिता का नाम दर्ज करें"
                className={errors.fathersName ? 'border-red-500' : ''}
              />
            </div>

            {/* Mother's Name */}
            <div>
              <label htmlFor="mothersName" className="block text-sm font-medium text-gray-700 mb-2">
                Mother's Name / माता का नाम: <span className="text-red-500">*</span>
              </label>
              <Input
                id="mothersName"
                {...register('mothersName', { required: "Mother's name is required / माता का नाम आवश्यक है" })}
                error={errors.mothersName?.message}
                placeholder="Enter mother's name / माता का नाम दर्ज करें"
                className={errors.mothersName ? 'border-red-500' : ''}
              />
            </div>

            {/* Spouse's Name */}
            <div>
              <label htmlFor="spousesName" className="block text-sm font-medium text-gray-700 mb-2">
                Spouse's Name / पति/पत्नी का नाम:
              </label>
              <Input
                id="spousesName"
                {...register('spousesName')}
                placeholder="Enter spouse's name / पति/पत्नी का नाम दर्ज करें"
              />
            </div>

            {/* Address */}
            <div className="md:col-span-2">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                Address / पता: <span className="text-red-500">*</span>
              </label>
              <Input
                id="address"
                {...register('address', { required: 'Address is required / पता आवश्यक है' })}
                error={errors.address?.message}
                placeholder="Enter address / पता दर्ज करें"
                className={errors.address ? 'border-red-500' : ''}
              />
            </div>

            {/* Cause of Death */}
            <div>
              <label htmlFor="causeOfDeath" className="block text-sm font-medium text-gray-700 mb-2">
                Cause of Death / मृत्यु का कारण: <span className="text-red-500">*</span>
              </label>
              <Input
                id="causeOfDeath"
                {...register('causeOfDeath', { required: 'Cause of death is required / मृत्यु का कारण आवश्यक है' })}
                error={errors.causeOfDeath?.message}
                placeholder="Enter cause of death / मृत्यु का कारण दर्ज करें"
                className={errors.causeOfDeath ? 'border-red-500' : ''}
              />
            </div>

            {/* Age at Death */}
            <div>
              <label htmlFor="ageAtDeath" className="block text-sm font-medium text-gray-700 mb-2">
                Age at Death / मृत्यु के समय आयु: <span className="text-red-500">*</span>
              </label>
              <Input
                id="ageAtDeath"
                {...register('ageAtDeath', { required: 'Age at death is required / मृत्यु के समय आयु आवश्यक है' })}
                error={errors.ageAtDeath?.message}
                placeholder="Enter age / आयु दर्ज करें"
                className={errors.ageAtDeath ? 'border-red-500' : ''}
              />
            </div>

            {/* Minister's Name */}
            <div className="md:col-span-2">
              <label htmlFor="ministersName" className="block text-sm font-medium text-gray-700 mb-2">
                Minister's Name / मंत्री का नाम: <span className="text-red-500">*</span>
              </label>
              <Input
                id="ministersName"
                {...register('ministersName', { required: "Minister's name is required / मंत्री का नाम आवश्यक है" })}
                error={errors.ministersName?.message}
                placeholder="Enter minister's name / मंत्री का नाम दर्ज करें"
                className={errors.ministersName ? 'border-red-500' : ''}
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-end">
            <Button
              type="button"
              onClick={handleReset}
              variant="outline"
              className="hover:bg-gray-100 transition-all duration-200 hover:shadow-md"
            >
              Reset / रीसेट
            </Button>
            <Button
              type="button"
              onClick={handlePrint}
              variant="secondary"
              className="hover:shadow-md transition-all duration-200"
            >
              Print / प्रिंट
            </Button>
            <Button
              type="submit"
              loading={isSubmitting}
              className="hover:shadow-lg transition-all duration-200 transform hover:scale-105"
            >
              {isEditing ? 'Update / अपडेट' : 'Save / सहेजें'}
            </Button>
          </div>
        </form>

        {/* Footer Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-700">Parochial Seal / पेरोकियल सील</p>
            </div>
            <div className="text-right mt-4 md:mt-0">
              <p className="text-sm font-medium text-gray-700">Date / दिनांक: {new Date().toLocaleDateString()}</p>
              <p className="text-sm font-medium text-gray-700 mt-2">Father-in-charge / प्रभारी फादर</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DeathCertificate

