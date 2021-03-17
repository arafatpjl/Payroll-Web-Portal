using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using CrystalDecisions.CrystalReports.Engine;
using CrystalDecisions.Shared;
using System.Web.Mvc; 


namespace PacificPortal.Controllers
{
    public class CrystalReportPdfResult : ActionResult
    {
        private readonly byte[] _contentBytes;


        //https://www.mythicalmanmoth.com/2014/07/18/returning-a-crystal-report-as-a-pdf-actionresult-in-asp-net-mvc/

        public CrystalReportPdfResult(string reportPath, object dataSet)
        {
            ReportDocument reportDocument = new ReportDocument();
            reportDocument.Load(reportPath);
            //reportDocument.SetDataSource(dataSet);
            _contentBytes = StreamToBytes(reportDocument.ExportToStream(ExportFormatType.PortableDocFormat));

        }

        public override void ExecuteResult(ControllerContext context)
        {

            var response = context.HttpContext.ApplicationInstance.Response;
            response.Clear();
            response.Buffer = false;
            response.ClearContent();
            response.ClearHeaders();
            response.Cache.SetCacheability(HttpCacheability.Public);
            response.ContentType = "application/pdf";

            using (var stream = new MemoryStream(_contentBytes))
            {
                stream.WriteTo(response.OutputStream);
                stream.Flush();
            }
        }

        private static byte[] StreamToBytes(Stream input)
        {
            byte[] buffer = new byte[16 * 1024];
            using (MemoryStream ms = new MemoryStream())
            {
                int read;
                while ((read = input.Read(buffer, 0, buffer.Length)) > 0)
                {
                    ms.Write(buffer, 0, read);
                }
                return ms.ToArray();
            }
        }
    }
}