namespace Comercializadora.WebApi.Common
{
    public sealed class Response<TType>
    {
        public bool Ok { get; set; }

        public string Codigo { get; set; }

        public string Mensaje { get; set; }

        public TType Data { get; set; } = default(TType);

        // Métodos para Responses exitosas
        public static Response<TType> Success()
        {
            return Success("");
        }

        public static Response<TType> Success(string mensaje)
        {
            return new Response<TType>
            {
                Ok = true,
                Mensaje = mensaje
            };
        }

        public static Response<TType> Success(TType data)
        {
            return Success(data, "");
        }

        public static Response<TType> Success(TType data, string mensaje, string codigo = "")
        {
            return new Response<TType>
            {
                Ok = true,
                Mensaje = mensaje,
                Data = data,
                Codigo = codigo
            };
        }

        public static Response<TType> Fault(string mensaje = "", string codigoError = "", TType data = default(TType))
        {
            return new Response<TType>
            {
                Ok = false,
                Mensaje = mensaje,
                Codigo = codigoError,
                Data = data
            };
        }
    }
}
