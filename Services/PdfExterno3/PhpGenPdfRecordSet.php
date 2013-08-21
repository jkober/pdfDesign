<?php
namespace Design\DesignBundle\Services\PdfExterno3;
use Design\DesignBundle\Services\PdfExterno3\PhpGenPdfDb as Db;
use PDO;
class PhpGenPdfRecordSet {
    /** @var        BdPdo           */
    protected $conn             = "";
    /** @var        PDOStatement    */
    protected $recordSet        = "";
    protected $registro         = array();
    protected $registroOri      = array();
    protected $fieldSeteados    = false;
    protected $addNew           = false;
    protected $nextRealizado    = false;
    //--------------------------------------------------------------------------
    protected $rowAfect         = 0;
    protected $typeResult       = "";
    //--------------------------------------------------------------------------
    public function close(){
        $this->recordSet->closeCursor();
    }
    /**
     * @param boolean $opcion  True-->PDO::FETCH_ASSOC y False-->PDO::FETCH_BOTH
     */
    public function setResultAsociativo($opcion=true) {
        if ($opcion) {
            $this->typeResult = PDO::FETCH_ASSOC;
        } else {
            $this->typeResult = PDO::FETCH_BOTH;
        }
    }
    /**
     * Ejecuta una consulta
     *
     * @param string $ssql Consulta a ejecutar
     * @param string $ConnName Nombre de la coneccion sobre la que se ejecutara la consulta
     */
    public function __construct($ssql, $paramSql = "", $ConnName="") {
        $this->typeResult = PDO::FETCH_ASSOC;
        if (trim($ssql) != "") {
            $this->conn         = Db::getConexion($ConnName);
            $this->recordSet    = $this->conn->query($ssql,$paramSql);
            $this->rowAfect     = $this->conn->getRowAfect();
        }
        
/*        $this->typeResult = PDO::FETCH_ASSOC;
        if (trim($ssql) != "") {
            $this->conn         = Db::getConexion($ConnName);
            $pdo = $this->conn->prepare($ssql);
            if ($paramSql !="") {
            $this->recordSet    = $pdo->execute($paramSql);
            }else{
            $this->recordSet    = $pdo->execute();
                
            }
            $this->recordSet = $pdo;
            $this->rowAfect     = $pdo->rowCount();// $this->conn->getRowAfect();
        }
 * */
 
    }
    /**
     * Devuelve el registro actual
     * @param boolean $ComoObjeto indica si el retoyno sera una registro (array) o un objeto
     * @return object
     */
    public function getRegistro($ComoObjeto=true) {
        if ($this->nextRealizado) {
            if ($ComoObjeto) {
                return (Object) $this->registro;
            } else {
                return $this->registro;
            }
        } else {
            return $this->next($ComoObjeto);
        }
    }
    /**
     * Retortna el siguiente registro y false cuando llego al ultimo
     *
     * @param true $ComoObjeto indica si se retorna un objeto o un array
     * @return array
     * @return boolean false si no hay datos
     */
    public function next($ComoObjeto=true) {
        if (is_object($this->recordSet)) {
            $this->nextRealizado    = true;
            $aux                    = $this->conn->next($this->recordSet, $this->typeResult);
            if ($aux == false) {return false;}
            $this->registro     = $aux;
            $this->registroOri  = $this->registro;
            if ($this->registro == false) {
                return false;
            }
            return $this->getRegistro($ComoObjeto);
        } else {
            return false;
        }
    }
    /**
     * Obtiene el valor de la funcion
     *
     * @param string $function
     * @return unknown
     */
    protected function getCampos($function) {
        $Var = strtolower(substr($function, 3, 1)) . substr($function, 4);
        if (is_array($this->registro)) {
            if (array_key_exists($Var, $this->registro)) {
                return $this->registro[$Var];
            } else {
                throw new Exception_Code("Llamada a un metodo en RecordSet donde no existe su equivalencia" . $function, 2);
            }
        }
    }
    /**
     * Ejecuta una funcion con sus argumentos
     *
     * @param string $function Nombre de la funcion
     * @param array $args Argumentos de la funcion
     */
    public function __call($function, $args) {
        if (substr($function, 0, 3) == "get") {
            return $this->getCampos($function);
        } else {
            throw new Exception_Code("Llamada a un metodo en FactoRecordSet donde no existe su equivalencia", 2);
        }
    }
    /**
     * Cantidad de registros afectados en la ultima operacion
     *
     * @return integer
     */
    public function getRowAfect() {
        return $this->rowAfect;
    }
}
?>