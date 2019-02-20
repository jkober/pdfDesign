<?php

namespace Design\DesignBundle\Services\PdfExterno3;

use Design\DesignBundle\Services\PdfExterno3;
use Design\DesignBundle\Services\PdfExterno3\PhpGenPdfDb as Db;
use Design\DesignBundle\Services\PdfExterno3\PhpGenPdfRecordSet as RecordSet;

class PhpGenPdfControll {
    protected static $returnInBase64= false;
    protected static $rootDir = "";
    protected static $db=null;
    public static function setReturnInBase64() {
        self::$returnInBase64=true;
    }
    function __construct($rootDir="",$db=null,$db2=null) {
        self::$rootDir = dirname($rootDir) . "/web/";
        
        $dbs = new PhpGenPdfDb($db);
        $dbs = new PhpGenPdfDb($db2,"design");
        
        self::$db=Db::getConexion("design");
    }
    public static function imprimirV3($name, $obj = null) {
        $baseDir=dirname(dirname(dirname(__DIR__)))."/comercial/";
        self::$rootDir=$baseDir."/web/";
        //dirname(dirname(dirname(__DIR__)))."/comercial/
        $fileToOpen=$baseDir."/src/Design/DesignBundle/report/".$name;
        if (is_file($fileToOpen)) {
            $cont=  json_decode(file_get_contents($fileToOpen));
        }
        //----------------------------------------------------------------------
        $sql = $cont->reportExtras->sql;
        if (is_object($obj)) {
            foreach ($obj as $k => $v) {
                $sql = str_replace("{" . $k . "}", $v, $sql);
            }
        }
        //if ($rs == null) {
        $rs = new \RecordSet($sql);
        $rs->setResultAsociativo();
        //}
        //----------------------------------------------------------------------
        try {
            //return self::version3symfo($cont, $rs); //, $rs, $name);
            return self::version3Local($cont, $rs); //, $rs, $name);
        } catch (Exceptions $e) {
            echo $e->getMessage();
            exit;
        }
        
    }
    public static function getPdf($name, $extras = null) {
        $file = "report/" . $name;
        if (file_exists($file)) {
            $cont = file_get_contents($file);
            return self::imprimir(con, $xtras);
        } else {
            return false;
        }
    }

    public static function imprimir($json, $obj = null) {
        $cont = $json;
        //----------------------------------------------------------------------
        $sql = $cont->reportExtras->sql;
        if (is_object($obj)) {
            foreach ($obj as $k => $v) {
                $sql = str_replace("{" . $k . "}", $v, $sql);
            }
        }
        //if ($rs == null) {
        $rs = new RecordSet($sql);
        $rs->setResultAsociativo();
        //}
        //----------------------------------------------------------------------
        try {
            return self::version3symfo($cont, $rs); //, $rs, $name);
        } catch (Exceptions $e) {
            echo $e->getMessage();
            exit;
        }
    }

    public static function imprimirFromDesign($json, $obj = null,$rs=null) {
        $cont = $json;
        //----------------------------------------------------------------------
        $sql = $cont->reportExtras->sql;
        if(stristr($sql, 'select ') === FALSE) {
            $sql =" select * from $sql ";
        }
        
        
        if (is_array($obj)) {
            foreach ($obj as $k => $v) {
                $sql = str_replace("{" . $v->name . "}", $v->value, $sql);
            }
        }
        if ($rs == null) {
            $rs = new RecordSet($sql);
            $rs->setResultAsociativo();
        }
        //----------------------------------------------------------------------
        try {
            return self::version3symfo($cont, $rs); //, $rs, $name);
        } catch (Exceptions $e) {
            echo $e->getMessage();
            exit;
        }
    }

    private static function version3Local($objPdf, $rs, $name = "") {
        /*
        ojo falta incluir las librerias para el manejo del tcppdf
        
        */
		importClass("PdfExterno3.PdfGenLeoRecordTable"	,F);
		importClass("PdfExterno3.PhpGenPdf"		,F);
		importClass("PdfExterno3.PhpGenPdfSections"	,F);
		importClass("PdfExterno3.VariableStream"	,F);
		importClass("PdfExterno3.fpdf17/FPDF"	,F);
		importClass("PdfExterno3.PdfGenRotate"	,F);
		importClass("PdfExterno3.PhpGenPdfFPDF"		,F);
		importClass("PdfExterno3.PhpGenPdfLibrary"	,F);
		importClass("PdfExterno3.PhpGenPdfBody"		,F);
		//importClass("PdfExterno3.PhpGenPdfDbLocal"		,F);
		importClass("PdfExterno3.PhpGenPdfFooter"	,F);
		importClass("PdfExterno3.PhpGenPdfFooterDocu"	,F);
		importClass("PdfExterno3.PhpGenPdfHead"		,F);
		importClass("PdfExterno3.PhpGenPdfHeadDocu"	,F);
                importClass("ClassAux.TmpGen"			,F);

//		importClass("PdfExterno3.PhpGenPdfRecordSet"	,F);
                
                
        $genPdf = new PhpGenPdf($objPdf);
        $genPdf->setDirRoot(\Path::getServer(A)."img/" );
        $genPdf->setDirSalida(\Path::getServer(B));
        $genPdf->setNameReportSal($name);
        //$genPdf->setIsUtf8(false);
        return $genPdf->creo($rs,"mm",true);
    }

    public  function getPdfSymfony2019($name,$filter){

        $connRep = self::$db;//->getConexion("ded");//->getConnection("pdfReport");
        try{
            //------------------------------------------------------------------
            $rep = $connRep->query("SELECT * FROM reportes where rep_name = '{$name}' " )->fetchAll();
//            return self::imprimirFromDesign(json_decode($rep[0]["rep_data"]),$obj,$rs);
            $cont = json_decode($rep[0]["rep_data"]);
            //----------------------------------------------------------------------
            $sql = $cont->reportExtras->sql;

            if(stristr($sql, 'select ') === FALSE) {
                throw new \Exception("Falta Select");

                return false;
                //$sql =" select * from $sql ";
            }
            $rs = new RecordSet($sql,$filter);
            $rs->setResultAsociativo();
            //----------------------------------------------------------------------------------------------------------
            try {
                return self::version3symfo($cont, $rs); //, $rs, $name);
            } catch (Exceptions $e) {
                throw $e;
            }
            //----------------------------------------------------------------------------------------------------------
        }catch (\Exception $e) {
            //----------------------------------------------------------------------------------------------------------
            throw $e;
            //----------------------------------------------------------------------------------------------------------
            //throw new \Exception("12","Error generando reporte");
        }
    }


    public  function getPdfSymfony($name,$obj=null,$rs=null){
        
        $connRep = self::$db;//->getConexion("ded");//->getConnection("pdfReport");
        try{
            //------------------------------------------------------------------
            $rep = $connRep->query("SELECT * FROM reportes where rep_name = '{$name}' " )->fetchAll();
            return self::imprimirFromDesign(json_decode($rep[0]["rep_data"]),$obj,$rs);
            
            //------------------------------------------------------------------
            //$repo = $rep[0]["rep_data"];
            //------------------------------------------------------------------
            //------------------------------------------------------------------
        }catch (\Exception $e) {
            throw $e;
            //throw new \Exception("12","Error generando reporte");
        }
    }
    private static function version3symfo($objPdf, $rs, $name = "") {
        //echo memory_get_usage() / 1048576 ."\n";
        $genPdf = new PhpGenPdf($objPdf);
        $genPdf->setDirRoot(self::$rootDir);
        $genPdf->setNameReportSal($name);
        $genPdf::$returnInBase64=self::$returnInBase64;
        return $genPdf->creo($rs);
        //$cc = $genPdf->creo($rs);
        //echo memory_get_usage() / 1048576 ."\n";
        //return $cc;

        
    }

}

?>
