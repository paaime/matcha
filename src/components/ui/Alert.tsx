import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/20/solid';

export default function Alert({
  alert,
}: {
  alert: { message: string; type: string };
}) {
  return (
    <div
      className={`rounded-md ${
        alert.type === 'error' ? 'bg-red-50' : 'bg-green-50'
      } p-4 mb-10`}
    >
      <div className="flex">
        <div className="flex-shrink-0">
          {alert.type === 'error' ? (
            <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
          ) : (
            <CheckCircleIcon
              className="h-5 w-5 text-green-400"
              aria-hidden="true"
            />
          )}
        </div>
        <div className="ml-3">
          <p
            className={`text-sm font-medium ${
              alert.type === 'error' ? 'text-red-800' : 'text-green-800'
            }`}
          >
            {alert.message}
          </p>
        </div>
      </div>
    </div>
  );
}
