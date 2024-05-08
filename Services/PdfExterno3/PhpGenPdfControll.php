<?php

namespace Design\DesignBundle\Services\PdfExterno3;

use Design\DesignBundle\Services\PdfExterno3\CrearFuncionTrait;
use Design\DesignBundle\Services\PdfExterno3\PhpGenPdfDb as Db;
use Design\DesignBundle\Services\PdfExterno3\PhpGenPdfRecordSet as RecordSet;

class PhpGenPdfControll {
    use CrearFuncionTrait;
    protected static $returnInBase64    = false;
    protected static $usaFpdfVersion    = "18";
    protected static $rootDir           = "";
    protected static $db                = null;
    public static function setReturnInBase64() {
        self::$returnInBase64=true;
    }
    public static function setUsaFpdfVersion ($usaFpdfVersion) {
        self::$usaFpdfVersion=$usaFpdfVersion;
    }

    function __construct($rootDir="",$db=null,$db2=null) {
        self::$rootDir = $rootDir . "/public/";

        $dbs = new PhpGenPdfDb($db);
        $dbs = new PhpGenPdfDb($db2,"design");

        self::$db=Db::getConexion("design");
    }
    public static function getPdf($name, $extras = null) {
        $file = "report/" . $name;
        if (file_exists($file)) {
            $cont = file_get_contents($file);
            return self::imprimir(con, $extras);
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
        $preSql="";
        //----------------------------------------------------------------------
        $sql = $cont->reportExtras->sql;
        if(stristr($sql, 'select ') === FALSE) {
            $sql =" select * from $sql ";
        }
        $tituloDefine= new \StdClass();
        if ($json->wherecondicional != "" ) {
            $parametrosX = array();
            if (is_array($obj)) {
                foreach ($obj as $v) {
                    if (substr($v->name, 0, 1) == ":") {
                        $parametrosX[$v->name] = $v->value;
                    }
                }
            }

            $FunctionVuelo = self::create_function('$p,$titulo', $json->wherecondicional);            $returns = $FunctionVuelo($parametrosX,$tituloDefine);
            $returns = $FunctionVuelo($parametrosX,$tituloDefine);
            if (is_array($returns) && count($returns) > 0) {
                if ( isset($returns["Sql"])){
                    if ( trim($returns["Sql"])!="") {
                        $sql=$returns["Sql"];
                    }
                }
                if ( isset($returns["preSql"])){
                    if ( trim($returns["preSql"])!="") {
                        $preSql=$returns["preSql"];
                    }
                }

                $a = implode(",", $returns);
                $pattern = '/:[a-z0-9]{2,30}/';
                $pattern = '/:[a-z_A-Z]+[a-z-0-9_A-Z]{1,30}/';
                preg_match_all($pattern, $a, $m, PREG_PATTERN_ORDER);
                if (isset($m[0])) {
                    $cc = array_flip($m[0]);

                    foreach ($cc as $k => $v) {
                        if ( $k != ":") {
                            if (!isset($parametrosX[$k])) {
                                throw new \Exception("Falta un parametro {$k}");
                            }
                        }
                    }
                    preg_match_all($pattern, $sql, $m, PREG_PATTERN_ORDER);
                    if (isset($m[0])) {
                        $cc1 = array_flip($m[0]);
                    } else {
                        $cc1 = array();
                    }

                    foreach ($parametrosX as $k => $v) {
                        if (!isset($cc[$k])) {
                            if (!isset($cc1[$k])) {
                                unset($parametrosX[$k]);
                            }
                        }
                    }
                }
                foreach ($returns as $k => $v ) {
                    $sql = str_replace("{$k}", $v, $sql);
                }
            }
        }else {
            $parametrosX = array();
            if (is_array($obj)) {
                foreach ($obj as $k => $v) {
                    $parametrosX[$v->name] = $v->value;
                    //$sql = str_replace("{" . $v->name . "}", $v->value, $sql);
                }
            }
        }
        if ( trim($preSql)  !="") {
            $db=PhpGenPdfDb::getConexion();
            $db->query($preSql);
        }
        if ($rs == null) {
            $rs = new RecordSet($sql,$parametrosX);
            $rs->setResultAsociativo();
        }
        //----------------------------------------------------------------------
        try {
            return self::version3symfo($cont, $rs,"",$tituloDefine); //, $rs, $name);
        } catch (Exceptions $e) {
            echo $e->getMessage();
            exit;
        }
    }


    public  function getPdfSymfony2019($name,$filter){

        $connRep = self::$db;
        $preSql         = "";
        $tituloDefine= new \StdClass();
        try{
            //------------------------------------------------------------------
            $rep = $connRep->query("SELECT * FROM reportes where rep_name = '{$name}' " )->fetchAll();
            $cont = json_decode($rep[0]["rep_data"]);
            //----------------------------------------------------------------------
            $sql = $cont->reportExtras->sql;

            if(stristr($sql, 'select ') === FALSE) {
                throw new \Exception("Falta Select");
                return false;
            }
            //----------------------------------------------------------------------------------------------------------
            if ($cont->wherecondicional != "" ) {
                $FunctionVuelo = self::create_function('$p,$titulo', $cont->wherecondicional);
                $returns = $FunctionVuelo($filter,$tituloDefine);
                if (is_array($returns) && count($returns) > 0) {
                    if ( isset($returns["Sql"])){
                        if ( trim($returns["Sql"])!="") {
                            $sql=$returns["Sql"];
                        }
                    }
                    if ( isset($returns["preSql"])){
                        if ( trim($returns["preSql"])!="") {
                            $preSql=$returns["preSql"];
                        }
                    }

                    //--------------------------------------------------------------------------------------------------
                    $a = implode(",", $returns);
                    $pattern = '/:[a-z0-9]{2,30}/';
                    $pattern = '/:[a-z0-9_A-Z]{2,30}/';
                    $pattern = '/:[a-z_A-Z]+[a-z-0-9_A-Z]{1,30}/';
                    preg_match_all($pattern, $a, $m, PREG_PATTERN_ORDER);
                    //--------------------------------------------------------------------------------------------------
                    if (isset($m[0])) {
                        //----------------------------------------------------------------------------------------------
                        $cc = array_flip($m[0]);
                        foreach ($cc as $k => $v) {
                            if (!isset($filter[$k])) {
                                throw new \Exception("Falta un parametro {$k}");
                            }
                        }
                        //----------------------------------------------------------------------------------------------
                        preg_match_all($pattern, $sql, $m, PREG_PATTERN_ORDER);
                        if (isset($m[0])) {
                            $cc1 = array_flip($m[0]);
                        } else {
                            $cc1 = array();
                        }
                        //----------------------------------------------------------------------------------------------
                        foreach ($filter as $k => $v) {
                            if (!isset($cc[$k])) {
                                if (!isset($cc1[$k])) {
                                    unset($filter[$k]);
                                }
                            }
                        }
                        //----------------------------------------------------------------------------------------------
                    }
                    foreach ($returns as $k => $v ) {
                        $sql = str_replace("{$k}", $v, $sql);
                    }
                }
            }
            if ( trim($preSql)  !="") {
                $db=PhpGenPdfDb::getConexion();
                $db->query($preSql);
            }
            //----------------------------------------------------------------------------------------------------------
            $rs = new RecordSet($sql,$filter);
            $rs->setResultAsociativo();
            //----------------------------------------------------------------------------------------------------------
            try {
                return self::version3symfo($cont, $rs,"",$tituloDefine);
            }catch (Exceptions $e) {
                throw $e;
            }
            //----------------------------------------------------------------------------------------------------------
        }catch (\Exception $e) {
            //----------------------------------------------------------------------------------------------------------
            throw $e;
            //----------------------------------------------------------------------------------------------------------
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
    private static function version3symfo($objPdf, $rs, $name = "",$tituloDefine=null) {
        //echo memory_get_usage() / 1048576 ."\n";
        //--------------------------------------------------------------------------------------------------------------
        $genPdf = new PhpGenPdf($objPdf,$tituloDefine);
        //--------------------------------------------------------------------------------------------------------------
        //--------------------------------------------------------------------------------------------------------------
        $genPdf->setDirRoot(self::$rootDir);
        $genPdf->setNameReportSal($name);
        $genPdf::$returnInBase64=self::$returnInBase64;
        $genPdf::$usaFpdfVersion=self::$usaFpdfVersion;
        //--------------------------------------------------------------------------------------------------------------
        return $genPdf->creo($rs);
        //--------------------------------------------------------------------------------------------------------------
        //$cc = $genPdf->creo($rs);
        //echo memory_get_usage() / 1048576 ."\n";
        //return $cc;


    }
    public  function getPdfSymfony2020($name,$filter,$extrasToPdfGen){
        $preSql     = "";
        $connRep = self::$db;
        $tituloDefine= new \StdClass();
        try{
            //------------------------------------------------------------------
            $rep = $connRep->query("SELECT * FROM reportes where rep_name = '{$name}' " )->fetchAll();
            $cont = json_decode($rep[0]["rep_data"]);
            //----------------------------------------------------------------------
            $sql = $cont->reportExtras->sql;

            if(stristr($sql, 'select ') === FALSE) {
                throw new \Exception("Falta Select");
                return false;
            }
            //----------------------------------------------------------------------------------------------------------
            if ($cont->wherecondicional != "" ) {
                $FunctionVuelo = self::create_function('$p,$titulo', $cont->wherecondicional);
                $returns = $FunctionVuelo($filter,$tituloDefine);
                if (is_array($returns) && count($returns) > 0) {
                    if ( isset($returns["Sql"])){
                        if ( trim($returns["Sql"])!="") {
                            $sql=$returns["Sql"];
                        }
                    }
                    if ( isset($returns["preSql"])){
                        if ( trim($returns["preSql"])!="") {
                            $preSql=$returns["preSql"];
                        }
                    }
                    //--------------------------------------------------------------------------------------------------
                    $a = implode(",", $returns);
                    $pattern = '/:[a-z0-9]{2,30}/';
                    $pattern = '/:[a-z0-9_A-Z]{2,30}/';
                    $pattern = '/:[a-z_A-Z]+[a-z-0-9_A-Z]{1,30}/';
                    preg_match_all($pattern, $a, $m, PREG_PATTERN_ORDER);
                    //--------------------------------------------------------------------------------------------------
                    if (isset($m[0])) {
                        //----------------------------------------------------------------------------------------------
                        $cc = array_flip($m[0]);
                        foreach ($cc as $k => $v) {
                            if (!isset($filter[$k])) {
                                throw new \Exception("Falta un parametro {$k}");
                            }
                        }
                        //----------------------------------------------------------------------------------------------
                        preg_match_all($pattern, $sql, $m, PREG_PATTERN_ORDER);
                        if (isset($m[0])) {
                            $cc1 = array_flip($m[0]);
                        } else {
                            $cc1 = array();
                        }
                        //----------------------------------------------------------------------------------------------
                        foreach ($filter as $k => $v) {
                            if (!isset($cc[$k])) {
                                if (!isset($cc1[$k])) {
                                    unset($filter[$k]);
                                }
                            }
                        }
                        //----------------------------------------------------------------------------------------------
                    }
                    foreach ($returns as $k => $v ) {
                        $sql = str_replace("{$k}", $v, $sql);
                    }
                }
            }
            //----------------------------------------------------------------------------------------------------------
            if ( trim($preSql)  !="") {
                $db=PhpGenPdfDb::getConexion();
                $db->query($preSql);
            }
            //----------------------------------------------------------------------------------------------------------
            $rs = new RecordSet($sql,$filter);
            $rs->setResultAsociativo();
            //----------------------------------------------------------------------------------------------------------
            try {
                return self::version3symfo2020($cont, $rs,"",$tituloDefine,$extrasToPdfGen);
            }catch (Exceptions $e) {
                throw $e;
            }
            //----------------------------------------------------------------------------------------------------------
        }catch (\Exception $e) {
            //----------------------------------------------------------------------------------------------------------
            throw $e;
            //----------------------------------------------------------------------------------------------------------
        }
    }
    private static function version3symfo2020($objPdf, $rs, $name = "",$tituloDefine=null,$extrasToPdfGen=null) {
        //echo memory_get_usage() / 1048576 ."\n";
        //--------------------------------------------------------------------------------------------------------------
        $genPdf = new PhpGenPdf($objPdf,$tituloDefine);
        $genPdf->pdfGenExtras = $extrasToPdfGen;
        //--------------------------------------------------------------------------------------------------------------
        //--------------------------------------------------------------------------------------------------------------
        $genPdf->setDirRoot(self::$rootDir);
        $genPdf->setNameReportSal($name);
        $genPdf::$returnInBase64=self::$returnInBase64;
        $genPdf::$usaFpdfVersion=self::$usaFpdfVersion;
        //--------------------------------------------------------------------------------------------------------------
        return $genPdf->creo($rs);
        //--------------------------------------------------------------------------------------------------------------
        //$cc = $genPdf->creo($rs);
        //echo memory_get_usage() / 1048576 ."\n";
        //return $cc;


    }

}

?>
