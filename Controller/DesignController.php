<?php

namespace Design\DesignBundle\Controller;

use Design\DesignBundle\Services\PdfExterno3\CrearFuncionTrait;
use Design\DesignBundle\Services\PdfExterno3\PhpGenPdfControll;
use Design\DesignBundle\Services\PdfExterno3\PhpGenPdfDb as Db;
use Doctrine\DBAL\Connection;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Finder\Finder;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\Filesystem\Exception\IOException;
/**
 * Description of DesignController dfdf
 * @author JKober
 * @Template("@Design/design/json.json.twig")
 */
class DesignController extends AbstractController {
    use CrearFuncionTrait;
    public function getRequest()
    {

        return $this->container->get('request_stack')->getCurrentRequest();
    }

    public function getGraficAction() {
        //----------------------------------------------------------------------
        $obj = json_decode($this->getRequest()->request->get('json'))->json;
        $v = self::create_function('', 'return ' . $obj->Sources->fieldsArray[0]->value . ';');
        $l = self::create_function('', 'return ' . $obj->Sources->fieldsArray[1]->value . ';');
        //----------------------------------------------------------------------
        $sal = array("data" => array("success" => false, "def" => null));
        //----------------------------------------------------------------------
        try {
            $dt = $v();
            $ly = $l();
            //------------------------------------------------------------------
            $PhpGenGraph = $this->get("design_php_gen_graf");
            $graph = $PhpGenGraph->getPieGraph();
            $graph->title->Set($obj->GrafTitle);
            $p1 = $PhpGenGraph->getPiePlot3D($dt);
            $p1->SetLegends($ly);
            $graph->Add($p1);
            $source = $graph->Stroke(_IMG_HANDLER);
            //------------------------------------------------------------------
            $sal["data"]["success"] = true;
            $sal["data"]["def"] = $PhpGenGraph->getRenderB64($source, $obj);
            $sal["data"]["heigh"] = number_format($obj->PositionHeight / (96 / 25.4), 1, '.', ',');
            //------------------------------------------------------------------
        } catch (Exceptions $e) {
            $sal["data"]["def"] = "mal";
        }
        return $sal;
    }
    public function abrirListarAction($bkp) {
        /**
         * @var $connRep \Doctrine\DBAL\Connection
         */
        $connRep = $this->getDoctrine()->getConnection("pdfReport");
        //$connRep->connect();
        //$connRep=$connRep->getNativeConnection();
        if ($bkp == "false") {
            $rep = $connRep->fetchAllAssociative("SELECT 0 as bkp, rep_id as id,rep_name as name ,rep_date FROM reportes  order by rep_name");
        } else {
            $rep = $connRep->fetchAllAssociative("SELECT 1 as bkp,rep_idH as id,rep_name || '_' || rep_date as name FROM reportesH order by rep_name,rep_idH");
        }
        //----------------------------------------------------------------------
        $toOpen = array();
        $toOpen["data"] = array();
        $toOpen["data"]["success"] = true;
        $toOpen["data"]["def"] = array();
        
        foreach ($rep as $repor) {
            //------------------------------------------------------------------
            $f              = (object) array();
            $f->fileName    = $repor["name"];
            $f->id          = $repor["id"];
            $f->bkp         = $repor["bkp"];
            $toOpen["data"]["def"][] = $f;
            //------------------------------------------------------------------
        }
        return $toOpen;
    }
    /**
     * Este metodo falta implementar las clase de filesistem
     * no usarlo asi con mkdir
     * @return json
     */
    public function reporteGuardarAction() {
        //----------------------------------------------------------------------
        $json               = json_decode($this->getRequest()->request->get('json'));
        //----------------------------------------------------------------------
        //----------------------------------------------------------------------
        $sal                = (object)array();
        $sal->success       = true;
        $sal->data          = (object)array();
        $sal->data->result  = false;
        $sal->data->success = false;
        $sal->data->mensaje = "";
        $name = $json->reportExtras->name;
        try{
            $connRep = $this->getDoctrine()->getConnection("pdfReport");
            $rep = $connRep->fetchAllAssociative("SELECT * FROM reportes where rep_name = '" . $name . "'");
            if ( count($rep) == 0 ) {
                //------------------------------------------------------------------
                $ssql = "insert into reportes (rep_id,rep_name,rep_data,rep_date ) values (null,:rep_name,:rep_data, :rep_date)";
                //------------------------------------------------------------------
                $stmt =$connRep->prepare($ssql);
                $stmt->bindValue("rep_name",$name);
                $stmt->bindValue("rep_data",$this->getRequest()->request->get('json'));
                $stmt->bindValue("rep_date",date("Y-m-d H:i:s"));
                $stmt->execute();
                //------------------------------------------------------------------
                $rep = $connRep->fetchAllAssociative("SELECT * FROM reportes where rep_name = '" . $name . "'");
                //------------------------------------------------------------------
                $ssql = "insert into reportesH select null,reportes.* from reportes where rep_id=:rep_id";
                $stmt =$connRep->prepare($ssql);
                $stmt->bindValue("rep_id",$rep[0]["rep_id"]);
                $stmt->execute();
                //------------------------------------------------------------------
            }else{
                //------------------------------------------------------------------            
                $ssql = "insert into reportesH select null,reportes.* from reportes where rep_id= :rep_id ";
                $stmt =$connRep->prepare($ssql);
                $stmt->bindValue("rep_id", intval($rep[0]["rep_id"]));
                $stmt->execute();
                //------------------------------------------------------------------
                $ssql = "update reportes set rep_data = :rep_data, rep_date=:rep_date where rep_id=:rep_id";
                $stmt =$connRep->prepare($ssql);
                $stmt->bindValue("rep_id",$rep[0]["rep_id"]);
                $stmt->bindValue("rep_data",$this->getRequest()->request->get('json'));
                $stmt->bindValue("rep_date",date("Y-m-d H:i:s"));
                $stmt->execute();
                //------------------------------------------------------------------
            }
            $sal->data->success = true;
            $sal->data->result  = true;
        }catch(\Exception $e) {
            $sal->data->mensaje = "\n".$e->getMessage();
        }
        return array("data"=>$sal);
    }
        //----------------------------------------------------------------------
    public function reporteAbrirAction() {
        $connRep = $this->getDoctrine()->getConnection("pdfReport");
        $data               = (object) array();
        $data->success      = false;
        $data->data         = (object) array();
        $data->data->result = "";
        $data->data->success= false;
        try{
            //------------------------------------------------------------------
            $json                   = json_decode($this->getRequest()->request->get('json'));
            if ($json!=null&&$json->bkp == 1) {
                $rep = $connRep->fetchAllAssociative("SELECT * FROM reportesH where rep_idH = " . $json->id );
            }else{
                $rep = $connRep->fetchAllAssociative("SELECT * FROM reportes where rep_id = " . $json->id );
            }
            //------------------------------------------------------------------
            $data->data->result = $rep[0]["rep_data"];
            //------------------------------------------------------------------
            $data->success      = true;
            $data->data->success= true;
            //------------------------------------------------------------------
        }catch (Exception $e) {}
        return array("data" => $data);
    }

    public function reporteVerAction() {
        //----------------------------------------------------------------------
        $sal                = (object)array();
        $sal->success       = true;
        $sal->data          = (object)array();
        $sal->data->result  = "";
        $sal->data->success = false;
        //----------------------------------------------------------------------
        try {
            $this->get("design_php_gen_pdf");
            //------------------------------------------------------------------
            $fs     = new Filesystem();
            $json   = json_decode($this->getRequest()->request->get('json'));
            $db     = $json->reportExtras->bdName;
            //------------------------------------------------------------------
            if (trim($db) != "") {
                Db::getConexion()->setBD($db);
            }
            //------------------------------------------------------------------
            $cc = $this->get('kernel')->getProjectDir() . "/public";
            //------------------------------------------------------------------
            if (! $fs->exists($cc . "/tmp/")) {
                try{
                    $fs->mkdir($cc . "/tmp",0777);
                }catch( IOException $e){
                    throw new \Exception("Falta crear el directorio web/tmp con permisos de escritura");
                }
            }
            //------------------------------------------------------------------
            $cc = $this->getRequest()->getBasePath();
            //------------------------------------------------------------------
            $sal->data->result  = $cc . "/tmp/" . PhpGenPdfControll::imprimirFromDesign($json, $json->reportExtras->param);
            $sal->data->success = true;
            //------------------------------------------------------------------
        }catch(\Exception  $e){
            $sal->data->result=$e->getMessage();
        }
        catch( IOException $e){
            $sal->data->result=$e->getMessage();
        }
        //----------------------------------------------------------------------
        return array("data" => $sal);
        //----------------------------------------------------------------------
    }
    public function imagenListarAction() {
        define("_EBarra", "/");
        //----------------------------------------------------------------------        
        $toOpen = array();
        $toOpen["data"] = array();
        $toOpen["data"]["success"] = true;
        $toOpen["data"]["def"] = array();
        //----------------------------------------------------------------------        
        $dir = dirname($this->get('kernel')->getRootDir()) . str_replace("/", _EBarra, "/web/bundles/design/report/");
        //----------------------------------------------------------------------
        $finder = new Finder();
        $finder->files()->in($dir)->exclude("js")->exclude("css");
        $ext = array("", "gif", "jpg", "png");
        //----------------------------------------------------------------------
        foreach ($finder as $file) {
            //------------------------------------------------------------------
            $c = intval(exif_imagetype($file->getRealPath()));
            //------------------------------------------------------------------
            if ($c > 0 && $c < 4) {
                //--------------------------------------------------------------
                $fi = (object) array();
                $fi->fileName = "design/report/" . str_replace("\\", "/", $file->getRelativePathname());
                //--------------------------------------------------------------
                $s = getimagesize($file->getRealPath());
                //--------------------------------------------------------------
                $fi->TypeImagen = $ext[$c];
                //--------------------------------------------------------------
                $fi->height = number_format($s[1] / (9.6 / 2.54), 0);
                $fi->width = number_format($s[0] / (9.6 / 2.54), 0);
                //--------------------------------------------------------------
                $toOpen["data"]["def"][] = $fi;
                //--------------------------------------------------------------
            }
            //------------------------------------------------------------------
        }
        //----------------------------------------------------------------------
        return $toOpen;
        //----------------------------------------------------------------------
    }
    public function procesarSqlAction() {
        try{
            $sal                = (object) array();
            $sal->data          = (object) array();
            $sal->success       = true;
            $sal->data->success = false;
            $sal->data->def     = array();
            $sal->data->error   = "";
            //------------------------------------------------------------------
            $json               = json_decode($this->getRequest()->request->get('json'));
            $r                  = $this->get("design_php_gen_sql_def");
            //------------------------------------------------------------------
            $sal->data->def     =  $r->get($json);
            $sal->data->success = true;
            //------------------------------------------------------------------
        }catch(\Exception $e){
            $sal->data->error = $e->getMessage();
        }
        return array("data"=>$sal);
    }

    protected function getFont() {
        $dir = dirname(dirname(__DIR__) . "/Services/PdfExterno3/fpdf17/font/courier.php");
        $ruta = dirname(__DIR__) . "/Services/PdfExterno3/fpdf17/font/";
        $salida = array();
        //$loadFont = self::create_function('$fontNames', 'include ($fontNames); $ab = get_defined_vars();return $ab;');
        //-----------------------------------------------------------------------------------------
        $loadFont = function($fontNames) { include ($fontNames); $ab = get_defined_vars(); return $ab; };
        //-----------------------------------------------------------------------------------------
        if ($dh = opendir($dir)) {
            while (($file = readdir($dh)) !== false) {
                if (!is_dir($ruta . $file) && $file != "." && $file != ".." && $file != ".svn" && substr($file, -3) == "php") {
                    //----------------------------------------------------------
                    $info = $loadFont($ruta . $file);
                    //----------------------------------------------------------
                    $d = array();
                    //----------------------------------------------------------
                    $sal["up"]                      = $info["up"];
                    $sal["ut"]                      = $info["ut"];
                    $max                            = $info["cw"]["Z"];
                    $max2                           = $info["cw"]["0"];
                    $sal["max"]                     = $max;
                    $sal["maxNum"]                  = $max2;
                    $sal["name"]                    = substr($file, 0, -4);
                    $salida[substr($file, 0, -4)]   = $sal;
                    //----------------------------------------------------------
                }
            }
        }
        return $salida;
    }
    /** @Template("@Design/design/load_app.html.twig") */
    public function loadAppAction() {
        return array("fonts" => json_encode($this->getFont()));
    }
    /**
     * depreciada
     * @return 
     */
    public function reporteGuardarActionInFile() {
        //----------------------------------------------------------------------
        $json               = json_decode($this->getRequest()->request->get('json'));
        //----------------------------------------------------------------------
        //----------------------------------------------------------------------
        $sal                = (object)array();
        $sal->success       = true;
        $sal->data          = (object)array();
        $sal->data->result  = false;
        $sal->data->success = false;
        $sal->data->mensaje = "";
        //----------------------------------------------------------------------
        try {
            //------------------------------------------------------------------
            $fs                 = new Filesystem();
            $dirBase            = dirname(__DIR__) . "/report/";
            //------------------------------------------------------------------
            if ($fs->exists($dirBase . $json->reportExtras->name)) {
                $fecha  = date("U");
                $dirBkp = $dirBase . "bkp";
                if (! $fs->exists($dirBkp)){
                    $fs->mkdir($dirBkp, 0777);
                }
                //--------------------------------------------------------------
                $dirBkp .="/";
                //--------------------------------------------------------------
                if (! $fs->exists($dirBkp . $json->reportExtras->name)) {
                    $fs->mkdir($dirBkp . $json->reportExtras->name, 0777);
                }
                //--------------------------------------------------------------
                $fileSal    = $dirBkp . $json->reportExtras->name . "/" . $json->reportExtras->name . $fecha;
                $fileData   = $this->getRequest()->request->get('json');
                //--------------------------------------------------------------
                if (function_exists('gzcompress')) {
                    $fileData=gzcompress($this->getRequest()->request->get('json'));
                }
                //--------------------------------------------------------------
                if ( @file_put_contents($fileSal, $fileData ) === false  ) {
                    $sal->data->mensaje = "\nError no tipoficado al guardar en el Directorio Reporte";
                    if (! is_null($error)) {
                        $sal->data->mensaje = "\n".$error['message'];
                    }
                }
                //--------------------------------------------------------------
            }
            if ( @file_put_contents(dirname(__DIR__) . "/report/" . $json->reportExtras->name, $this->getRequest()->request->get('json')) === false ){
                $sal->data->mensaje = "\nError no tipoficado al guardar en el Directorio Reporte";
                if (! is_null($error)) {
                    $sal->data->mensaje = "\n".$error['message'];
                }
            }else{
                $sal->data->success = true;
                $sal->data->result  = true;
            }
        } catch (IOException $e) {
            $sal->data->mensaje = "\n".$e->getMessage();
        }
        return array("data"=>$sal);

    }
      public function abrirListarActionInFile($bkp) {
        /** @var $finder Symfony\Component\Finder\Finder */
        $finder = new Finder();
        if ($bkp == "false") {
            $finder->files()
                    ->in(dirname(__DIR__) . "/report/")
                    ->exclude("bkp");
        } else {
            $finder->files()->in(dirname(__DIR__) . "/report/bkp");
        }
        //----------------------------------------------------------------------
        $toOpen = array();
        $toOpen["data"] = array();
        $toOpen["data"]["success"] = true;
        $toOpen["data"]["def"] = array();
        foreach ($finder as $file) {
            //------------------------------------------------------------------
            $f = (object) array();
            $f->fileName = str_replace("\\", "/", $file->getRelativePathname());
            $toOpen["data"]["def"][] = $f;
            //------------------------------------------------------------------
        }
        return $toOpen;
    }
      public function reporteAbrirActionInFile() {
        $data               = (object) array();
        $data->success      = false;
        $data->data         = (object) array();
        $data->data->result = "";
        $data->data->success= false;
        try{
            //------------------------------------------------------------------
            $json                   = json_decode($this->getRequest()->request->get('json'));
            $data->data->result    = file_get_contents(dirname(__DIR__) . "/report/" . $json->name);
            //------------------------------------------------------------------
            if ( substr($json->name, 0, 4) == "bkp/" ) {
                if ( function_exists('gzuncompress') ) {
                     $data->data->result = gzuncompressa( $data->data->result);
                }
            }
            //------------------------------------------------------------------
            $data->success      = true;
            $data->data->success= true;
            //------------------------------------------------------------------
        }catch (Exception $e) {}
        return array("data" => $data);
    }

}
?>
