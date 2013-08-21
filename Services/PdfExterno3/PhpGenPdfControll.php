<?php

namespace Design\DesignBundle\Services\PdfExterno3;

use Design\DesignBundle\Services\PdfExterno3;
use Design\DesignBundle\Services\PdfExterno3\PhpGenPdfDb as Db;
use Design\DesignBundle\Services\PdfExterno3\PhpGenPdfRecordSet as RecordSet;

class PhpGenPdfControll {

    protected static $rootDir = "";

    function __construct($rootDir="") {
        self::$rootDir = dirname($rootDir) . "/web/";
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

    public static function imprimirFromDesign($json, $obj = null) {
        $cont = $json;
        //----------------------------------------------------------------------
        $sql = $cont->reportExtras->sql;
        if (is_array($obj)) {
            foreach ($obj as $k => $v) {
                $sql = str_replace("{" . $v->name . "}", $v->value, $sql);
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
    
    
    private static function version3symfo($objPdf, $rs, $name = "") {
        //echo memory_get_usage() / 1048576 ."\n";
        $genPdf = new PhpGenPdf($objPdf);
        $genPdf->setDirRoot(self::$rootDir);
        $genPdf->setNameReportSal($name);
        return $genPdf->creo($rs);
        //$cc = $genPdf->creo($rs);
        //echo memory_get_usage() / 1048576 ."\n";
        //return $cc;

        
    }

}

?>