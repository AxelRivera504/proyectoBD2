namespace Comercializadora.WebApi.Features.CreationProduct.Dto
{
    public class ElaboracionPayload
    {
        public int IdProductoFinal { get; set; }
        public int CantidadElaborada { get; set; }
        public List<InsumoUsadoDto> Insumos { get; set; }
    }
}
